const repositorio = require('../repositorios/tareaRepositorio');
const { crearError } = require('../middlewares/errores');
const {
  notificarTareaCreada,
  notificarTareaActualizada,
  notificarTareaEliminada
} = require('../eventos/socket');

function limpiarTarea(datos) {
  return {
    titulo: typeof datos.titulo === 'string' ? datos.titulo.trim() : datos.titulo,
    descripcion: typeof datos.descripcion === 'string' ? datos.descripcion.trim() : (datos.descripcion || null),
    estado: datos.estado ? String(datos.estado).trim().toUpperCase() : 'PENDIENTE',
    prioridad: datos.prioridad ? String(datos.prioridad).trim().toUpperCase() : 'MEDIA',
    fechaLimite: datos.fechaLimite || null
  };
}

class TareaServicio {
  async listarTareas(filtros = {}) {
    return repositorio.listar(filtros.estado, filtros.prioridad);
  }

  async obtenerTarea(id) {
    const tarea = await repositorio.buscarPorId(id);
    if (!tarea) {
      throw crearError(`No existe una tarea con el ID ${id}`, 404);
    }
    return tarea;
  }

  async crearTarea(datos) {
    const tareaLimpia = limpiarTarea(datos);

    const duplicado = await repositorio.buscarDuplicado(tareaLimpia.titulo, tareaLimpia.estado);
    if (duplicado) {
      throw crearError(`Conflicto: Ya existe una tarea con el título "${tareaLimpia.titulo}" en estado "${tareaLimpia.estado}"`, 409);
    }

    const nuevaTarea = await repositorio.crear(tareaLimpia);
    notificarTareaCreada(nuevaTarea);
    return nuevaTarea;
  }

  async actualizarTarea(id, datos) {
    const actual = await repositorio.buscarPorId(id);
    if (!actual) {
      throw crearError(`No existe una tarea con el ID ${id}`, 404);
    }

    const datosLimpios = {
      titulo: datos.titulo !== undefined ? datos.titulo.trim() : undefined,
      descripcion: datos.descripcion !== undefined ? (datos.descripcion ? datos.descripcion.trim() : null) : undefined,
      estado: datos.estado ? String(datos.estado).trim().toUpperCase() : undefined,
      prioridad: datos.prioridad ? String(datos.prioridad).trim().toUpperCase() : undefined,
      fechaLimite: datos.fechaLimite !== undefined ? datos.fechaLimite : undefined
    };

    if (datosLimpios.titulo) {
      const estadoValidar = datosLimpios.estado || actual.estado;
      const duplicado = await repositorio.buscarDuplicado(datosLimpios.titulo, estadoValidar, id);
      if (duplicado) {
        throw crearError(`Conflicto: Otra tarea ya tiene el título "${datosLimpios.titulo}"`, 409);
      }
    }

    const versionEsperada = datos.version !== undefined ? Number(datos.version) : null;
    const { afectadas, tareaActualizada } = await repositorio.actualizar(id, datosLimpios, versionEsperada);

    if (afectadas === 0 && versionEsperada !== null) {
      throw crearError('Conflicto de concurrencia: La tarea fue modificada por otro usuario. Recargue los datos.', 409);
    }

    notificarTareaActualizada(tareaActualizada);
    return tareaActualizada;
  }

  async eliminarTarea(id) {
    const tarea = await repositorio.buscarPorId(id);
    if (!tarea) {
      throw crearError(`No existe una tarea con el ID ${id}`, 404);
    }

    await repositorio.eliminar(id);
    notificarTareaEliminada(id);
    return { mensaje: 'Tarea eliminada exitosamente' };
  }
}

module.exports = new TareaServicio();
