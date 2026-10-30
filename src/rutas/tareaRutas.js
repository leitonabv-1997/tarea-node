const { Router } = require('express');
const controlador = require('../controladores/tareaControlador');

const router = Router();

router.get('/', controlador.listar);
router.get('/:id', controlador.obtenerPorId);
router.post('/', controlador.crear);
router.put('/:id', controlador.actualizar);
router.patch('/:id', controlador.actualizar);
router.delete('/:id', controlador.eliminar);

module.exports = router;
