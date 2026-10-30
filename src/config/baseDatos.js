const mysql = require('mysql2/promise');
const env = require('./env');

let pool = null;

async function iniciarBaseDatos() {
  if (pool) return pool;

  const conexionAdmin = await mysql.createConnection({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword
  });

  await conexionAdmin.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.dbName}\` CHARACTER SET utf8mb4;`
  );
  await conexionAdmin.end();

  pool = mysql.createPool({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName,
    waitForConnections: true,
    connectionLimit: 10
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tareas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(120) NOT NULL,
      descripcion TEXT,
      estado ENUM('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
      prioridad ENUM('BAJA', 'MEDIA', 'ALTA') NOT NULL DEFAULT 'MEDIA',
      fecha_limite VARCHAR(50),
      version INT NOT NULL DEFAULT 1,
      creado_en VARCHAR(50) NOT NULL,
      actualizado_en VARCHAR(50) NOT NULL
    );
  `);

  return pool;
}

function obtenerBaseDatos() {
  if (!pool) throw new Error('Base de datos no inicializada');
  return pool;
}

module.exports = {
  iniciarBaseDatos,
  obtenerBaseDatos
};
