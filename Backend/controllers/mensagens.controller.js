const db = require('../database');

// ========================================
// ENVIAR MENSAGEM (PÚBLICO)
// POST /api/mensagens
// ========================================
const enviarMensagem = (req, res) => {
    const body = req.body || {};
    const fields = ['nome', 'email', 'mensagem'];

    // Valida campos vazios ou ausentes
    if (
        fields.some(
            (field) => typeof body[field] !== 'string' || !body[field].trim()
        )
    ) {
        return res.status(400).json({
            error: 'Por favor, preencha todos os campos.'
        });
    }

    const [nome, email, mensagem] = fields.map((field) => body[field].trim());

    // Validação de formato de e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
        return res.status(400).json({
            error: 'Informe um e-mail válido.'
        });
    }

    const sql = `
        INSERT INTO mensagens (nome, email, mensagem)
        VALUES (?, ?, ?)
    `;

    db.run(sql, [nome, email, mensagem], function (err) {
        if (err) {
            console.error('Erro ao salvar mensagem:', err.message);
            return res.status(500).json({
                error: 'Erro ao salvar mensagem no banco de dados.'
            });
        }

        res.status(201).json({
            message: 'Mensagem enviada com sucesso!',
            id: this.lastID
        });
    });
};


// ========================================
// LISTAR MENSAGENS (PROTEGIDO - ADMIN)
// GET /api/mensagens
// ========================================
const listarMensagens = (req, res) => {
    const sql = `
        SELECT id, nome, email, mensagem, data_envio
        FROM mensagens
        ORDER BY data_envio DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar mensagens:', err.message);
            return res.status(500).json({
                error: 'Erro ao buscar mensagens no banco de dados.'
            });
        }

        res.json(rows || []);
    });
};

module.exports = {
    enviarMensagem,
    listarMensagens
};
