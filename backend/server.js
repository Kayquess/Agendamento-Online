// =========================
// 📦 Dependências
// =========================
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// =========================
// 🔐 Validação do .env
// =========================
const REQUIRED_ENV = [
  'DATABASE_URL',
  'EMAIL_USER',
  'EMAIL_PASS',
  'FRONTEND_URL',
  'PORT',
];

const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length) {
  console.error(`❌ Faltam variáveis no .env: ${missing.join(', ')}`);
  process.exit(1);
}

// =========================
// 🗄️ Configuração do Banco PostgreSQL
// =========================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necessário para Supabase
  },
});

pool.connect()
  .then(() => console.log('✅ Banco PostgreSQL conectado'))
  .catch(err => {
    console.error('❌ Erro ao conectar no banco PostgreSQL:', err.message);
    process.exit(1);
  });

// =========================
// 📧 Configuração do Email
// =========================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

(async () => {
  try {
    await transporter.verify();
    console.log('✅ Conexão SMTP funcionando');
  } catch (err) {
    console.error('❌ Erro na conexão SMTP:', err);
    process.exit(1);
  }
})();

// =========================
// 🚀 Inicialização do App
// =========================
const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

// =========================
// 🛠️ ROTAS
// =========================

// 👉 Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });

  try {
    const { rows: users } = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email]
    );

    if (!users.length)
      return res.status(404).json({ error: 'Usuário não encontrado.' });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(401).json({ error: 'Senha incorreta.' });

    delete user.password;
    res.json({ user });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno no login.' });
  }
});

// 👉 Cadastro
app.post('/api/cadastrar', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

  try {
    const { rows: exists } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (exists.length)
      return res.status(409).json({ error: 'E-mail já cadastrado.' });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashed]
    );

    res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ error: 'Erro interno no cadastro.' });
  }
});

// 👉 Agendar Serviço
app.post('/api/agendar', async (req, res) => {
  const { name, phone, service, date, time } = req.body;

  if (!name || !phone || !service || !date || !time)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

  try {
    const { rows: conflict } = await pool.query(
      'SELECT id FROM bookings WHERE date = $1 AND time = $2 AND service = $3',
      [date, time, service]
    );

    if (conflict.length)
      return res.status(409).json({ error: 'Horário já reservado.' });

    await pool.query(
      'INSERT INTO bookings (name, phone, service, date, time) VALUES ($1, $2, $3, $4, $5)',
      [name, phone, service, date, time]
    );

    res.status(201).json({ message: 'Agendamento realizado com sucesso!' });
  } catch (err) {
    console.error('Erro no agendamento:', err);
    res.status(500).json({ error: 'Erro interno no agendamento.' });
  }
});

// 👉 Recuperação de Senha
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ error: 'E-mail é obrigatório.' });

  try {
    const { rows: users } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (!users.length)
      return res.status(404).json({ error: 'Usuário não encontrado.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_expires = $2 WHERE id = $3',
      [token, expires, users[0].id]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `Suporte <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <h2>Recuperação de senha</h2>
        <p>Clique no link abaixo para redefinir sua senha. O link expira em 1 hora:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Se não solicitou, ignore este e-mail.</p>
      `,
    });

    res.json({ message: 'E-mail de recuperação enviado.' });
  } catch (err) {
    console.error('Erro no envio do e-mail:', err);
    res.status(500).json({ error: 'Erro interno no envio do e-mail.' });
  }
});

// 👉 Resetar Senha
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword)
    return res.status(400).json({ error: 'Nova senha é obrigatória.' });

  try {
    const { rows: users } = await pool.query(
      'SELECT id, reset_expires FROM users WHERE reset_token = $1',
      [token]
    );

    if (!users.length)
      return res.status(400).json({ error: 'Token inválido ou expirado.' });

    const user = users[0];

    if (new Date() > new Date(user.reset_expires))
      return res.status(400).json({ error: 'Token expirado.' });

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_expires = NULL WHERE id = $2',
      [hashed, user.id]
    );

    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ error: 'Erro interno na redefinição de senha.' });
  }
});

// =========================
// 🚫 Rota Não Encontrada
// =========================
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// =========================
// 🛑 Middleware de Erro
// =========================
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

// =========================
// 🚀 Start Server
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
