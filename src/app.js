const path = require('node:path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocumento = require('./docs/swagger');
const tareaRutas = require('./rutas/tareaRutas');
const { manejadorErrores } = require('./middlewares/errores');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumento));

app.get('/health', (req, res) => {
  res.json({ estado: 'ok', fecha: new Date().toISOString() });
});

app.use('/api/tareas', tareaRutas);

app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

app.use(manejadorErrores);

module.exports = app;
