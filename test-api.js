const http = require('node:http');
const assert = require('node:assert/strict');
const app = require('./src/app');
const { iniciarBaseDatos } = require('./src/config/baseDatos');
const { iniciarSocket } = require('./src/eventos/socket');

async function ejecutarPruebas() {
  console.log('--- Iniciando Pruebas: CRUD Básico (Express + MySQL + Swagger) ---');
  await iniciarBaseDatos();

  const servidor = http.createServer(app);
  iniciarSocket(servidor);

  await new Promise((resolver) => servidor.listen(3099, resolver));
  const baseUrl = 'http://localhost:3099';

  try {
    // 1. Health check
    console.log('1. GET /health...');
    const resHealth = await fetch(`${baseUrl}/health`);
    assert.equal(resHealth.status, 200);
    const healthJson = await resHealth.json();
    assert.equal(healthJson.estado, 'ok');
    console.log('✓ GET /health pasó');

    // 2. Swagger UI
    console.log('2. GET /api-docs/ (Swagger)...');
    const resSwagger = await fetch(`${baseUrl}/api-docs/`);
    assert.equal(resSwagger.status, 200);
    console.log('✓ Swagger UI disponible (200 OK)');

    // 3. Validación manual (título < 3 caracteres -> 400 Bad Request)
    console.log('3. POST /api/tareas (validación manual)...');
    const resVal = await fetch(`${baseUrl}/api/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'ab' })
    });
    assert.equal(resVal.status, 400);
    const valJson = await resVal.json();
    assert.equal(valJson.exito, false);
    assert.ok(valJson.detalles.length > 0);
    console.log('✓ Validación manual devolvió 400 con detalles');

    // 4. Crear tarea válida (201 Created)
    console.log('4. POST /api/tareas (Crear tarea)...');
    const titulo = `Deber CRUD ${Date.now()}`;
    const resCrear = await fetch(`${baseUrl}/api/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo,
        descripcion: 'CRUD de tareas en Express y MySQL',
        prioridad: 'ALTA'
      })
    });
    assert.equal(resCrear.status, 201);
    const crearJson = await resCrear.json();
    assert.equal(crearJson.exito, true);
    assert.equal(crearJson.datos.titulo, titulo);
    assert.equal(crearJson.datos.estado, 'PENDIENTE');
    const id = crearJson.datos.id;
    console.log(`✓ Tarea #${id} creada (201 Created)`);

    // 5. Conflicto por duplicado (409 Conflict)
    console.log('5. POST /api/tareas (Detección de duplicado)...');
    const resDup = await fetch(`${baseUrl}/api/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, estado: 'PENDIENTE' })
    });
    assert.equal(resDup.status, 409);
    console.log('✓ Conflicto detectado correctamente (409 Conflict)');

    // 6. Listar tareas (200 OK)
    console.log('6. GET /api/tareas (Listar)...');
    const resListar = await fetch(`${baseUrl}/api/tareas`);
    assert.equal(resListar.status, 200);
    const listarJson = await resListar.json();
    assert.equal(listarJson.exito, true);
    assert.ok(Array.isArray(listarJson.datos));
    console.log(`✓ Listado obtenido (${listarJson.datos.length} tareas)`);

    // 7. Obtener una tarea por ID (200 OK)
    console.log('7. GET /api/tareas/:id...');
    const resUna = await fetch(`${baseUrl}/api/tareas/${id}`);
    assert.equal(resUna.status, 200);
    const unaJson = await resUna.json();
    assert.equal(unaJson.datos.id, id);
    console.log('✓ Tarea obtenida por ID (200 OK)');

    // 8. Actualizar tarea y versión optimista (200 y 409)
    console.log('8. PATCH /api/tareas/:id...');
    const resAct = await fetch(`${baseUrl}/api/tareas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'EN_PROGRESO', version: 1 })
    });
    assert.equal(resAct.status, 200);
    const actJson = await resAct.json();
    assert.equal(actJson.datos.estado, 'EN_PROGRESO');
    assert.equal(actJson.datos.version, 2);

    const resVieja = await fetch(`${baseUrl}/api/tareas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'COMPLETADA', version: 1 })
    });
    assert.equal(resVieja.status, 409);
    console.log('✓ Actualización y concurrencia optimista funcionaron (200 y 409)');

    // 9. Eliminar tarea (200 OK)
    console.log('9. DELETE /api/tareas/:id...');
    const resElim = await fetch(`${baseUrl}/api/tareas/${id}`, { method: 'DELETE' });
    assert.equal(resElim.status, 200);
    console.log('✓ Tarea eliminada (200 OK)');

    // 10. Confirmar 404 al consultar tarea eliminada
    const resNoExiste = await fetch(`${baseUrl}/api/tareas/${id}`);
    assert.equal(resNoExiste.status, 404);
    console.log('✓ Confirmado 404 Not Found tras eliminación');

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DEL CRUD BÁSICO PASARON EXITOSAMENTE!');
  } finally {
    servidor.close();
  }
}

ejecutarPruebas().catch((err) => {
  console.error('Error durante las pruebas:', err);
  process.exit(1);
});
