# 📋 API para Gestión de Tareas (CRUD Básico)

API REST modular y sencilla desarrollada con **Node.js**, **Express**, **MySQL**, **Socket.IO** y documentación interactiva con **Swagger UI**.

---

## 🚀 Características Principales

- **CRUD Completo:** Crear, listar, obtener por ID, actualizar y eliminar tareas.
- **Códigos HTTP Estándar:** `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `409 Conflict`.
- **Validaciones Manuales:** Funciones en JavaScript puro para validación de entradas sin librerías externas.
- **Persistencia en MySQL:** Conexión mediante pool de conexiones con sentencias SQL preparadas seguras (`?`).
- **Control de Conflictos:** Detección de títulos duplicados y concurrencia optimista con campo `version` (HTTP 409).
- **Documentación con Swagger:** Interfaz visual interactiva en `/api-docs`.
- **Eventos en Tiempo Real:** Notificaciones automáticas vía WebSockets (Socket.IO).
- **Código en Español:** Nombres de funciones, variables, carpetas y rutas claras en español y sin sobreingeniería.

---

## 📁 Estructura del Proyecto

```text
BackendTareas/
├── package.json               # Dependencias del proyecto
├── .env / .env.example        # Variables de entorno para MySQL
├── INFORME_TECNICO.md         # Informe técnico formal (máx. 2 páginas)
├── README.md                  # Documentación del repositorio
├── test-api.js                # Pruebas automatizadas de los endpoints
├── public/
│   └── index.html             # Cliente web con WebSockets en vivo
└── src/
    ├── app.js                 # Configuración de Express y Swagger UI
    ├── server.js              # Arranque del servidor HTTP nativo y Socket.IO
    ├── config/
    │   ├── env.js             # Variables de entorno
    │   └── baseDatos.js       # Conexión y creación de tabla en MySQL
    ├── controladores/
    │   └── tareaControlador.js# Manejo de peticiones y respuestas HTTP
    ├── servicios/
    │   └── tareaServicio.js   # Lógica de negocio y emisión de eventos
    ├── repositorios/
    │   └── tareaRepositorio.js# Consultas SQL preparadas a MySQL
    ├── validadores/
    │   └── tareaValidador.js  # Validaciones manuales simples
    ├── middlewares/
    │   └── errores.js         # Formato uniforme de errores
    ├── eventos/
    │   └── socket.js          # Notificaciones en tiempo real con Socket.IO
    └── docs/
        └── swagger.js         # Especificación OpenAPI para Swagger UI
```

---

## ⚡ Instalación y Puesta en Marcha

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configuración de Base de Datos
El archivo `.env` viene configurado por defecto para XAMPP / MySQL local:
```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=tareas_db
```
> La base de datos `tareas_db` y la tabla `tareas` se crean automáticamente al arrancar la aplicación.

### 3. Iniciar el Servidor
```bash
npm start
```

### 4. Accesos Rápidos
- **Documentación Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Panel Interactivo con WebSockets:** [http://localhost:3000](http://localhost:3000)
- **Diagnóstico:** [http://localhost:3000/health](http://localhost:3000/health)

---

## 📑 Ejemplos Reales de Petición y Respuesta

### 1. Crear Tarea (`POST /api/tareas`)
**Petición:**
```bash
curl -X POST http://localhost:3000/api/tareas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Preparar examen de Backend",
    "descripcion": "Estudiar Express, MySQL y WebSockets",
    "prioridad": "ALTA",
    "fechaLimite": "2026-10-30"
  }'
```
**Respuesta (`201 Created`):**
```json
{
  "exito": true,
  "mensaje": "Tarea creada con éxito",
  "datos": {
    "id": 1,
    "titulo": "Preparar examen de Backend",
    "descripcion": "Estudiar Express, MySQL y WebSockets",
    "estado": "PENDIENTE",
    "prioridad": "ALTA",
    "fecha_limite": "2026-10-30",
    "version": 1,
    "creado_en": "2026-10-25T03:20:16.672Z",
    "actualizado_en": "2026-10-25T03:20:16.672Z"
  }
}
```

---

### 2. Error de Validación Manual (`POST /api/tareas`)
**Petición con título inválido (menos de 3 caracteres):**
```bash
curl -X POST http://localhost:3000/api/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "ab"}'
```
**Respuesta (`400 Bad Request`):**
```json
{
  "exito": false,
  "mensaje": "Datos de tarea inválidos",
  "detalles": [
    "El título es obligatorio y debe tener al menos 3 caracteres"
  ]
}
```

---

### 3. Conflicto por Título Duplicado (`POST /api/tareas`)
**Petición con título ya existente en el mismo estado:**
```bash
curl -X POST http://localhost:3000/api/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Preparar examen de Backend", "estado": "PENDIENTE"}'
```
**Respuesta (`409 Conflict`):**
```json
{
  "exito": false,
  "mensaje": "Conflicto: Ya existe una tarea con el título \"Preparar examen de Backend\" en estado \"PENDIENTE\""
}
```

---

### 4. Listar Tareas (`GET /api/tareas`)
**Petición (con filtro opcional):**
```bash
curl "http://localhost:3000/api/tareas?estado=PENDIENTE"
```
**Respuesta (`200 OK`):**
```json
{
  "exito": true,
  "datos": [
    {
      "id": 1,
      "titulo": "Preparar examen de Backend",
      "descripcion": "Estudiar Express, MySQL y WebSockets",
      "estado": "PENDIENTE",
      "prioridad": "ALTA",
      "fecha_limite": "2026-10-30",
      "version": 1,
      "creado_en": "2026-10-25T03:20:16.672Z",
      "actualizado_en": "2026-10-25T03:20:16.672Z"
    }
  ]
}
```

---

### 5. Obtener Tarea por ID (`GET /api/tareas/:id`)
**Petición:**
```bash
curl http://localhost:3000/api/tareas/1
```
**Respuesta (`200 OK`):**
```json
{
  "exito": true,
  "datos": {
    "id": 1,
    "titulo": "Preparar examen de Backend",
    "descripcion": "Estudiar Express, MySQL y WebSockets",
    "estado": "PENDIENTE",
    "prioridad": "ALTA",
    "fecha_limite": "2026-10-30",
    "version": 1,
    "creado_en": "2026-10-25T03:20:16.672Z",
    "actualizado_en": "2026-10-25T03:20:16.672Z"
  }
}
```

---

### 6. Actualizar con Concurrencia Optimista (`PATCH /api/tareas/:id`)
**Petición con la versión actual (1):**
```bash
curl -X PATCH http://localhost:3000/api/tareas/1 \
  -H "Content-Type: application/json" \
  -d '{"estado": "EN_PROGRESO", "version": 1}'
```
**Respuesta (`200 OK`):**
```json
{
  "exito": true,
  "mensaje": "Tarea actualizada con éxito",
  "datos": {
    "id": 1,
    "titulo": "Preparar examen de Backend",
    "descripcion": "Estudiar Express, MySQL y WebSockets",
    "estado": "EN_PROGRESO",
    "prioridad": "ALTA",
    "fecha_limite": "2026-10-30",
    "version": 2,
    "creado_en": "2026-10-25T03:20:16.672Z",
    "actualizado_en": "2026-10-25T03:20:24.343Z"
  }
}
```

**Si otro cliente intenta actualizar enviando la versión desactualizada (1):**
```bash
curl -X PATCH http://localhost:3000/api/tareas/1 \
  -H "Content-Type: application/json" \
  -d '{"estado": "COMPLETADA", "version": 1}'
```
**Respuesta (`409 Conflict`):**
```json
{
  "exito": false,
  "mensaje": "Conflicto de concurrencia: La tarea fue modificada por otro usuario. Recargue los datos."
}
```

---

### 7. Eliminar Tarea (`DELETE /api/tareas/:id`)
**Petición:**
```bash
curl -X DELETE http://localhost:3000/api/tareas/1
```
**Respuesta (`200 OK`):**
```json
{
  "exito": true,
  "mensaje": "Tarea eliminada exitosamente"
}
```

**Si se vuelve a consultar la tarea eliminada:**
```bash
curl http://localhost:3000/api/tareas/1
```
**Respuesta (`404 Not Found`):**
```json
{
  "exito": false,
  "mensaje": "No existe una tarea con el ID 1"
}
```

---

## 🧪 Pruebas Automatizadas

El proyecto cuenta con una suite de pruebas automatizadas:
```bash
npm test
```
Verifica:
- Health check (200).
- Swagger UI disponible (200).
- Validación manual (400 con detalles).
- Creación (201).
- Conflicto por duplicado (409).
- Listado y filtros (200).
- Búsqueda por ID (200).
- Concurrencia optimista (200 y 409).
- Eliminación (200) y confirmación de no existencia (404).
