const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT
} = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_DATABASE) {
  console.error('❌ Variáveis de ambiente do banco de dados não definidas corretamente.');
  process.exit(1);
}

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: Number(DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log('✅ Conectado ao banco MySQL!');
    connection.release();
  } catch (err) {
    console.error('❌ Erro ao conectar no MySQL:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;
