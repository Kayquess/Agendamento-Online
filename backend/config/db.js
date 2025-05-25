// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'cadastro_db',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado ao banco MySQL!');
});

module.exports = db;
