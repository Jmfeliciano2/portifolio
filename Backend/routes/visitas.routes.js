const express = require('express');
const router = express.Router();

const visitasController = require('../controllers/visitas.controller');

// GET /api/visita - Registra um novo acesso
router.get('/visita', visitasController.registrarVisita);

// GET /api/visitas - Retorna o total de acessos acumulados
router.get('/visitas', visitasController.obterTotalVisitas);

module.exports = router;
