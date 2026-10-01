const express = require('express');
const router = express.Router();

const projetosController = require('../controllers/projetos.controller');
const autenticarAdmin = require('../middleware/auth.middleware');

// ========================================
// ROTAS PÚBLICAS
// ========================================

// GET /api/projetos - Lista todos os projetos
router.get('/', projetosController.listarProjetos);

// GET /api/projetos/:id - Busca projeto por ID
router.get('/:id', projetosController.buscarProjetoPorId);


// ========================================
// ROTAS PROTEGIDAS (ADMIN)
// Exigem cabeçalho Authorization: Bearer <token>
// ========================================

// POST /api/projetos - Cria novo projeto
router.post('/', autenticarAdmin, projetosController.criarProjeto);

// PUT /api/projetos/:id - Atualiza projeto existente
router.put('/:id', autenticarAdmin, projetosController.atualizarProjeto);

// DELETE /api/projetos/:id - Remove projeto existente
router.delete('/:id', autenticarAdmin, projetosController.deletarProjeto);

module.exports = router;