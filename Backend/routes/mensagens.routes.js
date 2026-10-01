const express = require('express');
const router = express.Router();

const mensagensController = require('../controllers/mensagens.controller');
const autenticarAdmin = require('../middleware/auth.middleware');

// POST /api/mensagens - Público (visitantes enviam mensagens pelo portfólio)
router.post('/', mensagensController.enviarMensagem);

// GET /api/mensagens - Protegido (apenas administrador autenticado pode ler mensagens)
router.get('/', autenticarAdmin, mensagensController.listarMensagens);

module.exports = router;
