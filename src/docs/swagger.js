const swaggerDocumento = {
  openapi: '3.0.0',
  info: {
    title: 'API de Gestión de Tareas',
    version: '1.0.0',
    description: 'Documentación de la API para gestión de tareas (CRUD básico con Node.js, Express y MySQL).'
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Servidor Local' }
  ],
  paths: {
    '/api/tareas': {
      get: {
        summary: 'Listar tareas',
        parameters: [
          { name: 'estado', in: 'query', schema: { type: 'string', enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'] } },
          { name: 'prioridad', in: 'query', schema: { type: 'string', enum: ['BAJA', 'MEDIA', 'ALTA'] } }
        ],
        responses: {
          200: { description: 'Lista de tareas obtenida correctamente' }
        }
      },
      post: {
        summary: 'Crear tarea',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['titulo'],
                properties: {
                  titulo: { type: 'string', example: 'Hacer el deber de programación' },
                  descripcion: { type: 'string', example: 'Completar el backend con Express y MySQL' },
                  estado: { type: 'string', enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'], default: 'PENDIENTE' },
                  prioridad: { type: 'string', enum: ['BAJA', 'MEDIA', 'ALTA'], default: 'MEDIA' },
                  fechaLimite: { type: 'string', example: '2026-10-30' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Tarea creada exitosamente' },
          400: { description: 'Datos de tarea inválidos' },
          409: { description: 'Conflicto por tarea duplicada' }
        }
      }
    },
    '/api/tareas/{id}': {
      get: {
        summary: 'Obtener tarea por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Detalle de la tarea' },
          404: { description: 'Tarea no encontrada' }
        }
      },
      put: {
        summary: 'Actualizar tarea por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  titulo: { type: 'string' },
                  descripcion: { type: 'string' },
                  estado: { type: 'string', enum: ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'] },
                  prioridad: { type: 'string', enum: ['BAJA', 'MEDIA', 'ALTA'] },
                  fechaLimite: { type: 'string' },
                  version: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Tarea actualizada exitosamente' },
          404: { description: 'Tarea no encontrada' },
          409: { description: 'Conflicto de versión o título duplicado' }
        }
      },
      delete: {
        summary: 'Eliminar tarea por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Tarea eliminada exitosamente' },
          404: { description: 'Tarea no encontrada' }
        }
      }
    }
  }
};

module.exports = swaggerDocumento;
