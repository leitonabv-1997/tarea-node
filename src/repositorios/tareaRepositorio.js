const { obtenerBaseDatos } = require('../config/baseDatos');

class TareaRepositorio {
  async listar(estado, prioridad) {
    const db = obtenerBaseDatos();
    const condiciones = [];
    const params = [];

    if (estado) {
      condiciones.push('estado = ?');
      params.push(estado);
    }
    if (prioridad) {
      condiciones.push('prioridad = ?');
      params.push(prioridad);
    }

    const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
    const [filas] = await db.query(`SELECT * FROM tareas ${where} ORDER BY id DESC`, params);
    return filas;
  }

  async buscarPorId(id) {
    const db = obtenerBaseDatos();
    const [filas] = await db.query('SELECT * FROM tareas WHERE id = ?', [id]);
    return filas[0] || null;
  }

  async buscarDuplicado(titulo, estado, idExcluir = null) {
    const db = obtenerBaseDatos();
    let sql = 'SELECT * FROM tareas WHERE LOWER(titulo) = LOWER(?) AND estado = ?';
    const params = [titulo, estado];

    if (idExcluir) {
      sql += ' AND id != ?';
      params.push(idExcluir);
    }

    const [filas] = await db.query(sql + ' LIMIT 1', params);
    return filas[0] || null;
  }

  async crear(datos) {
    const db = obtenerBaseDatos();
    const ahora = new Date().toISOString();

    const [resultado] = await db.query(
      `INSERT INTO tareas (titulo, descripcion, estado, prioridad, fecha_limite, version, creado_en, actualizado_en)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      [
        datos.titulo,
        datos.descripcion || null,
        datos.estado || 'PENDIENTE',
        datos.prioridad || 'MEDIA',
        datos.fechaLimite || null,
        ahora,
        ahora
      ]
    );

    return this.buscarPorId(resultado.insertId);
  }

  async actualizar(id, datos, versionEsperada = null) {
    const db = obtenerBaseDatos();
    const ahora = new Date().toISOString();
    const campos = [];
    const params = [];

    if (datos.titulo !== undefined) {
      campos.push('titulo = ?');
      params.push(datos.titulo);
    }
    if (datos.descripcion !== undefined) {
      campos.push('descripcion = ?');
      params.push(datos.descripcion);
    }
    if (datos.estado !== undefined) {
      campos.push('estado = ?');
      params.push(datos.estado);
    }
    if (datos.prioridad !== undefined) {
      campos.push('prioridad = ?');
      params.push(datos.prioridad);
    }
    if (datos.fechaLimite !== undefined) {
      campos.push('fecha_limite = ?');
      params.push(datos.fechaLimite);
    }

    campos.push('actualizado_en = ?');
    params.push(ahora);

    campos.push('version = version + 1');

    let sql = `UPDATE tareas SET ${campos.join(', ')} WHERE id = ?`;
    params.push(id);

    if (versionEsperada !== null && versionEsperada !== undefined) {
      sql += ' AND version = ?';
      params.push(versionEsperada);
    }

    const [resultado] = await db.query(sql, params);

    return {
      afectadas: resultado.affectedRows,
      tareaActualizada: await this.buscarPorId(id)
    };
  }

  async eliminar(id) {
    const db = obtenerBaseDatos();
    const [resultado] = await db.query('DELETE FROM tareas WHERE id = ?', [id]);
    return resultado.affectedRows > 0;
  }
}

module.exports = new TareaRepositorio();
