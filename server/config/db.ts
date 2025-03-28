import mysql from 'mysql2/promise';

const config = useRuntimeConfig();

const pool = mysql.createPool({
  host: config.public.dbHost || 'localhost',
  user: config.public.dbUser || 'root',
  password: config.public.dbPassword || '',
  database: config.public.dbName || 'maid_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;