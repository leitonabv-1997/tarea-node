const http = require('node:http');
const app = require('./app');
const env = require('./config/env');
const { iniciarBaseDatos } = require('./config/baseDatos');
const { iniciarSocket } = require('./eventos/socket');

async function iniciarServidor() {
  try {
    await iniciarBaseDatos();
    console.log(`Base de datos MySQL conectada (${env.dbHost}:${env.dbPort}/${env.dbName})`);

    const servidor = http.createServer(app);
    iniciarSocket(servidor);

    servidor.listen(env.puerto, () => {
      console.log(`Servidor activo en: http://localhost:${env.puerto}`);
      console.log(`Documentación Swagger: http://localhost:${env.puerto}/api-docs`);
      console.log(`Panel interactivo: http://localhost:${env.puerto}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

iniciarServidor();
