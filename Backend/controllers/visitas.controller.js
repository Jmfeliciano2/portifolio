const db = require('../database');

// ========================================
// REGISTRAR VISITA (PÚBLICO)
// GET /api/visita
// ========================================
const registrarVisita = (req, res) => {
    const sql = `
        INSERT INTO visitas DEFAULT VALUES
    `;

    db.run(sql, function (err) {
        if (err) {
            console.error('Erro ao registrar visita:', err.message);
            return res.status(500).json({
                error: 'Erro ao registrar visita no banco de dados.'
            });
        }

        res.json({
            message: 'Visita registrada com sucesso!',
            id: this.lastID
        });
    });
};


// ========================================
// CONSULTAR TOTAL DE VISITAS (PÚBLICO)
// GET /api/visitas
// ========================================
const obterTotalVisitas = (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total
        FROM visitas
    `;

    db.get(sql, [], (err, row) => {
        if (err) {
            console.error('Erro ao buscar visitas:', err.message);
            return res.status(500).json({
                error: 'Erro ao buscar visitas no banco de dados.'
            });
        }

        res.json({
            totalVisitas: row ? row.total : 0
        });
    });
};

module.exports = {
    registrarVisita,
    obterTotalVisitas
};
