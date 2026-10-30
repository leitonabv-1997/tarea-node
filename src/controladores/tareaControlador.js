const servicio = require('../servicios/tareaServicio');
const { validarCrearTarea, validarActualizarTarea } = require('../validadores/tareaValidador');
const { crearError } = require('../middlewares/errores');

class TareaControlador {
  async listar(req, res, next) {
    try {
      const tareas = await servicio.listarTareas(req.query);
      res.status(200).json({
        exito: true,
        datos: tareas
      });
    } catch (err) {
      next(err);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const tarea = await servicio.obtenerTarea(req.params.id);
      res.status(200).json({
        exito: true,
        datos: tarea
      });
    } catch (err) {
      next(err);
    }
  }

  async crear(req, res, next) {
    try {
      const validacion = validarCrearTarea(req.body);
      if (!validacion.esValido) {
        throw crearError('Datos de tarea inválidos', 400, validacion.errores);
      }

      const nuevaTarea = await servicio.crearTarea(req.body);
      res.status(201).json({
        exito: true,
        mensaje: 'Tarea creada con éxito',
        datos: nuevaTarea
      });
    } catch (err) {
      next(err);
    }
  }

  async actualizar(req, res, next) {
    try {
      const validacion = validarActualizarTarea(req.body);
      if (!validacion.esValido) {
        throw crearError('Datos de actualización inválidos', 400, validacion.errores);
      }

      const tareaActualizada = await servicio.actualizarTarea(req.params.id, req.body);
      res.status(200).json({
        exito: true,
        mensaje: 'Tarea actualizada con éxito',
        datos: tareaActualizada
      });
    } catch (err) {
      next(err);
    }
  }

  async eliminar(req, res, next) {
    try {
      const resultado = await servicio.eliminarTarea(req.params.id);
      res.status(200).json({
        exito: true,
        mensaje: resultado.mensaje
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TareaControlador();
