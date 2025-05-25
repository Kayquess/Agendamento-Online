// =========================
// 📦 Dependências
// =========================
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// =========================
// 🔐 Validação de Variáveis .env
// =========================
const REQUIRED_ENV = [
  'DB_HOST',
  'DB_USER',
  'DB_PASS',
  'EMAIL_USER',
  'EMAIL_PASS',
  'FRONTEND_URL',
  'PORT',
];

const missing = REQUIRED_ENV.filter(env => !process.env[env]);
if (missing.length) {
  console.error(`❌ Faltando variáveis no .env: ${missing.join(', ')}`);
  process.exit(1);
}

// =========================
// 🗄️ Configuração dos Bancos
// =========================
const createPool = (database) => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  pool.getConnection()
    .then(conn => {
      console.log(`✅ Banco '${database}' conectado`);
      conn.release();
    })
    .catch(err => {
      console.error(`❌ Erro ao conectar no banco '${database}':`, err.message);
      process.exit(1);
    });

  return pool;
};

const poolCadastro = createPool('cadastro_db');
const poolAgendamento = createPool('agendamento_db');

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
    console.log('✅ SMTP funcionando');
  } catch (error) {
    console.error('❌ Erro SMTP:', error);
    process.exit(1);
  }
})();

// =========================
// 🚀 Inicialização do App
// =========================
const app = express();
const port = process.env.PORT || 3001;

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
    const [rows] = await poolCadastro.query(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );

    if (!rows.length)
      return res.status(404).json({ error: 'Usuário não encontrado.' });

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(401).json({ error: 'Senha incorreta.' });

    delete user.password;
    res.json({ user });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no login.' });
  }
});

// 👉 Cadastro
app.post('/api/cadastrar', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

  try {
    const [exists] = await poolCadastro.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (exists.length)
      return res.status(409).json({ error: 'E-mail já cadastrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await poolCadastro.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno no cadastro.' });
  }
});

// 👉 Agendar Serviço
app.post('/api/agendar', async (req, res) => {
  const { name, phone, service, date, time } = req.body;

  if (!name || !phone || !service || !date || !time)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

  try {
    const [conflict] = await poolAgendamento.query(
      'SELECT id FROM bookings WHERE date = ? AND time = ? AND service = ?',
      [date, time, service]
    );

    if (conflict.length)
      return res.status(409).json({ error: 'Horário já reservado.' });

    await poolAgendamento.query(
      'INSERT INTO bookings (name, phone, service, date, time) VALUES (?, ?, ?, ?, ?)',
      [name, phone, service, date, time]
    );

    res.status(201).json({ message: 'Agendamento realizado com sucesso!' });
  } catch (error) {
    console.error('Erro no agendamento:', error);
    res.status(500).json({ error: 'Erro interno no agendamento.' });
  }
});

// 👉 Recuperação de Senha
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ error: 'E-mail é obrigatório.' });

  try {
    const [users] = await poolCadastro.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (!users.length)
      return res.status(404).json({ error: 'Usuário não encontrado.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await poolCadastro.query(
      'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?',
      [token, expires, users[0].id]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `Suporte <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperação de senha',
      html: `
        <h2>Recuperação de senha</h2>
        <p>Clique no link abaixo para redefinir sua senha. O link é válido por 1 hora:</p>
        <a href="${resetLink}">${resetLink}</a>
        <br/><br/>
        <p>Se você não solicitou, ignore este e-mail.</p>
      `,
    });

    res.json({ message: 'E-mail de recuperação enviado com sucesso.' });
  } catch (error) {
    console.error('Erro no envio do e-mail:', error);
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
    const [users] = await poolCadastro.query(
      'SELECT id, reset_expires FROM users WHERE reset_token = ?',
      [token]
    );

    if (!users.length)
      return res.status(400).json({ error: 'Token inválido ou já utilizado.' });

    const user = users[0];

    const now = new Date();
    const expires = new Date(user.reset_expires);

    if (now > expires)
      return res.status(400).json({ error: 'Token expirado.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await poolCadastro.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
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
// 🛑 Middleware Global de Erro
// =========================
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

// =========================
// 🚀 Iniciar Servidor
// =========================
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
