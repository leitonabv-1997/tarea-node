const { Server } = require('socket.io');

let io = null;

function iniciarSocket(servidorHttp) {
  io = new Server(servidorHttp, {
    cors: { origin: '*' }
  });
  return io;
}

function notificarTareaCreada(tarea) {
  if (io) io.emit('tarea_creada', tarea);
}

function notificarTareaActualizada(tarea) {
  if (io) io.emit('tarea_actualizada', tarea);
}

function notificarTareaEliminada(id) {
  if (io) io.emit('tarea_eliminada', { id });
}

module.exports = {
  iniciarSocket,
  notificarTareaCreada,
  notificarTareaActualizada,
  notificarTareaEliminada
};
