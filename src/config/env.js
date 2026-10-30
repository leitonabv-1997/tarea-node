require('dotenv').config();

module.exports = {
  puerto: parseInt(process.env.PORT, 10) || 3000,
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: parseInt(process.env.DB_PORT, 10) || 3306,
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'tareas_db'
};
