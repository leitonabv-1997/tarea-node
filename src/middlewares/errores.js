function manejadorErrores(err, req, res, next) {
  const estado = err.codigoEstado || 500;
  const mensaje = err.message || 'Error interno del servidor';
  const detalles = err.detalles || null;

  res.status(estado).json({
    exito: false,
    mensaje,
    ...(detalles ? { detalles } : {})
  });
}

function crearError(mensaje, codigoEstado = 400, detalles = null) {
  const error = new Error(mensaje);
  error.codigoEstado = codigoEstado;
  error.detalles = detalles;
  return error;
}

module.exports = {
  manejadorErrores,
  crearError
};
