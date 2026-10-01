const db = require('../database');

// Valida se o ID fornecido é um número inteiro positivo
function validarId(id) {
    if (!id || !/^\d+$/.test(String(id).trim())) {
        return null;
    }
    const num = parseInt(id, 10);
    return num > 0 ? num : null;
}

// Valida e sanitiza os campos obrigatórios e opcionais de um projeto
function validarDadosProjeto(body) {
    if (!body || typeof body !== 'object') {
        return { erro: 'Corpo da requisição inválido.' };
    }

    const {
        titulo,
        descricao,
        tecnologias,
        github_url,
        demo_url,
        imagem_url
    } = body;

    if (
        typeof titulo !== 'string' || !titulo.trim() ||
        typeof descricao !== 'string' || !descricao.trim() ||
        typeof tecnologias !== 'string' || !tecnologias.trim()
    ) {
        return { erro: 'Título, descrição e tecnologias são obrigatórios e não podem estar vazios.' };
    }

    return {
        dados: {
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            tecnologias: tecnologias.trim(),
            github_url: (typeof github_url === 'string' && github_url.trim()) ? github_url.trim() : null,
            demo_url: (typeof demo_url === 'string' && demo_url.trim()) ? demo_url.trim() : null,
            imagem_url: (typeof imagem_url === 'string' && imagem_url.trim()) ? imagem_url.trim() : null
        }
    };
}


// ========================================
// LISTAR TODOS OS PROJETOS
// GET /api/projetos
// ========================================
const listarProjetos = (req, res) => {
    const sql = `
        SELECT *
        FROM projetos
        ORDER BY data_criacao DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar projetos:', err.message);
            return res.status(500).json({
                error: 'Erro ao buscar projetos no banco de dados.'
            });
        }

        res.json(rows || []);
    });
};


// ========================================
// BUSCAR PROJETO POR ID
// GET /api/projetos/:id
// ========================================
const buscarProjetoPorId = (req, res) => {
    const idValido = validarId(req.params.id);

    if (!idValido) {
        return res.status(400).json({
            error: 'ID inválido. O identificador deve ser um número inteiro positivo.'
        });
    }

    const sql = `
        SELECT *
        FROM projetos
        WHERE id = ?
    `;

    db.get(sql, [idValido], (err, row) => {
        if (err) {
            console.error('Erro ao buscar projeto:', err.message);
            return res.status(500).json({
                error: 'Erro ao buscar projeto no banco de dados.'
            });
        }

        if (!row) {
            return res.status(404).json({
                error: 'Projeto não encontrado.'
            });
        }

        res.json(row);
    });
};


// ========================================
// CRIAR PROJETO
// POST /api/projetos
// ========================================
const criarProjeto = (req, res) => {
    const validacao = validarDadosProjeto(req.body);

    if (validacao.erro) {
        return res.status(400).json({
            error: validacao.erro
        });
    }

    const {
        titulo,
        descricao,
        tecnologias,
        github_url,
        demo_url,
        imagem_url
    } = validacao.dados;

    const sql = `
        INSERT INTO projetos (
            titulo,
            descricao,
            tecnologias,
            github_url,
            demo_url,
            imagem_url
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            titulo,
            descricao,
            tecnologias,
            github_url,
            demo_url,
            imagem_url
        ],
        function (err) {
            if (err) {
                console.error('Erro ao criar projeto:', err.message);
                return res.status(500).json({
                    error: 'Erro ao criar projeto no banco de dados.'
                });
            }

            res.status(201).json({
                message: 'Projeto criado com sucesso!',
                projeto: {
                    id: this.lastID,
                    titulo,
                    descricao,
                    tecnologias,
                    github_url,
                    demo_url,
                    imagem_url
                }
            });
        }
    );
};


// ========================================
// ATUALIZAR PROJETO
// PUT /api/projetos/:id
// ========================================
const atualizarProjeto = (req, res) => {
    const idValido = validarId(req.params.id);

    if (!idValido) {
        return res.status(400).json({
            error: 'ID inválido. O identificador deve ser um número inteiro positivo.'
        });
    }

    const validacao = validarDadosProjeto(req.body);

    if (validacao.erro) {
        return res.status(400).json({
            error: validacao.erro
        });
    }

    const {
        titulo,
        descricao,
        tecnologias,
        github_url,
        demo_url,
        imagem_url
    } = validacao.dados;

    const sql = `
        UPDATE projetos
        SET
            titulo = ?,
            descricao = ?,
            tecnologias = ?,
            github_url = ?,
            demo_url = ?,
            imagem_url = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [
            titulo,
            descricao,
            tecnologias,
            github_url,
            demo_url,
            imagem_url,
            idValido
        ],
        function (err) {
            if (err) {
                console.error('Erro ao atualizar projeto:', err.message);
                return res.status(500).json({
                    error: 'Erro ao atualizar projeto no banco de dados.'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: 'Projeto não encontrado.'
                });
            }

            res.json({
                message: 'Projeto atualizado com sucesso!'
            });
        }
    );
};


// ========================================
// DELETAR PROJETO
// DELETE /api/projetos/:id
// ========================================
const deletarProjeto = (req, res) => {
    const idValido = validarId(req.params.id);

    if (!idValido) {
        return res.status(400).json({
            error: 'ID inválido. O identificador deve ser um número inteiro positivo.'
        });
    }

    const sql = `
        DELETE FROM projetos
        WHERE id = ?
    `;

    db.run(sql, [idValido], function (err) {
        if (err) {
            console.error('Erro ao excluir projeto:', err.message);
            return res.status(500).json({
                error: 'Erro ao excluir projeto no banco de dados.'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Projeto não encontrado.'
            });
        }

        res.json({
            message: 'Projeto excluído com sucesso!'
        });
    });
};


module.exports = {
    listarProjetos,
    buscarProjetoPorId,
    criarProjeto,
    atualizarProjeto,
    deletarProjeto
};