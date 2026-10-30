const ESTADOS_VALIDOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];
const PRIORIDADES_VALIDAS = ['BAJA', 'MEDIA', 'ALTA'];

function validarCrearTarea(datos) {
  const errores = [];

  if (!datos.titulo || typeof datos.titulo !== 'string' || datos.titulo.trim().length < 3) {
    errores.push('El título es obligatorio y debe tener al menos 3 caracteres');
  }

  if (datos.titulo && datos.titulo.trim().length > 120) {
    errores.push('El título no puede superar los 120 caracteres');
  }

  if (datos.estado && !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.push(`El estado debe ser: ${ESTADOS_VALIDOS.join(', ')}`);
  }

  if (datos.prioridad && !PRIORIDADES_VALIDAS.includes(datos.prioridad)) {
    errores.push(`La prioridad debe ser: ${PRIORIDADES_VALIDAS.join(', ')}`);
  }

  return {
    esValido: errores.length === 0,
    errores
  };
}

function validarActualizarTarea(datos) {
  const errores = [];

  if (datos.titulo !== undefined) {
    if (typeof datos.titulo !== 'string' || datos.titulo.trim().length < 3) {
      errores.push('El título debe tener al menos 3 caracteres');
    }
    if (datos.titulo.trim().length > 120) {
      errores.push('El título no puede superar los 120 caracteres');
    }
  }

  if (datos.estado && !ESTADOS_VALIDOS.includes(datos.estado)) {
    errores.push(`El estado debe ser: ${ESTADOS_VALIDOS.join(', ')}`);
  }

  if (datos.prioridad && !PRIORIDADES_VALIDAS.includes(datos.prioridad)) {
    errores.push(`La prioridad debe ser: ${PRIORIDADES_VALIDAS.join(', ')}`);
  }

  return {
    esValido: errores.length === 0,
    errores
  };
}

module.exports = {
  validarCrearTarea,
  validarActualizarTarea
};
