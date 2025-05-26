const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // importante para conexão segura com Supabase
  },
});

pool.connect()
  .then(() => console.log('✅ Conectado ao banco Supabase!'))
  .catch((err) => {
    console.error('❌ Erro de conexão:', err);
    process.exit(1);
  });

module.exports = pool;
