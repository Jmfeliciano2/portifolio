const db = require('../database');


// ========================================
// LISTAR TODOS OS PROJETOS
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
                error: 'Erro ao buscar projetos'
            });
        }

        res.json(rows);
    });
};


// ========================================
// BUSCAR PROJETO POR ID
// ========================================

const buscarProjetoPorId = (req, res) => {

    const { id } = req.params;

    const sql = `
    SELECT *
    FROM projetos
    WHERE id = ?
  `;

    db.get(sql, [id], (err, row) => {

        if (err) {
            console.error('Erro ao buscar projeto:', err.message);

            return res.status(500).json({
                error: 'Erro ao buscar projeto'
            });
        }

        if (!row) {
            return res.status(404).json({
                error: 'Projeto não encontrado'
            });
        }

        res.json(row);
    });
};


// ========================================
// CRIAR PROJETO
// ========================================

const criarProjeto = (req, res) => {

    const {
        titulo,
        descricao,
        tecnologias,
        github_url,
        demo_url,
        imagem_url
    } = req.body;

    if (!titulo || !descricao || !tecnologias) {

        return res.status(400).json({
            error: 'Título, descrição e tecnologias são obrigatórios.'
        });
    }

    const sql = `
    INSERT INTO projetos
    (
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
            github_url || null,
            demo_url || null,
            imagem_url || null
        ],
        function (err) {

            if (err) {
                console.error('Erro ao criar projeto:', err.message);

                return res.status(500).json({
                    error: 'Erro ao criar projeto'
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
// ========================================

const atualizarProjeto = (req, res) => {

    const { id } = req.params;

    const {
        titulo,
        descricao,
        tecnologias,
        github_url,
        demo_url,
        imagem_url
    } = req.body;

    if (!titulo || !descricao || !tecnologias) {

        return res.status(400).json({
            error: 'Título, descrição e tecnologias são obrigatórios.'
        });
    }

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
            github_url || null,
            demo_url || null,
            imagem_url || null,
            id
        ],
        function (err) {

            if (err) {
                console.error('Erro ao atualizar projeto:', err.message);

                return res.status(500).json({
                    error: 'Erro ao atualizar projeto'
                });
            }

            if (this.changes === 0) {

                return res.status(404).json({
                    error: 'Projeto não encontrado'
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
// ========================================

const deletarProjeto = (req, res) => {

    const { id } = req.params;

    const sql = `
    DELETE FROM projetos
    WHERE id = ?
  `;

    db.run(sql, [id], function (err) {

        if (err) {
            console.error('Erro ao excluir projeto:', err.message);

            return res.status(500).json({
                error: 'Erro ao excluir projeto'
            });
        }

        if (this.changes === 0) {

            return res.status(404).json({
                error: 'Projeto não encontrado'
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