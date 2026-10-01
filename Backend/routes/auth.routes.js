const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body || {};

        if (!email || !senha || typeof email !== 'string' || typeof senha !== 'string') {
            return res.status(400).json({
                error: 'Informe e-mail e senha.'
            });
        }

        const emailRecebido = email.trim().toLowerCase();
        const emailConfigurado = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
        const hashConfigurado = (process.env.ADMIN_PASSWORD_HASH || '').trim();

        if (!emailConfigurado || !hashConfigurado || !process.env.JWT_SECRET) {
            console.error('Configuração de autenticação incompleta no servidor.');
            return res.status(500).json({
                error: 'Servidor não configurado para autenticação.'
            });
        }

        // Validação do e-mail
        if (emailRecebido !== emailConfigurado) {
            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        // Validação da senha com bcrypt
        const senhaCorreta = await bcrypt.compare(senha, hashConfigurado);

        if (!senhaCorreta) {
            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        // Geração do token JWT
        const token = jwt.sign(
            {
                role: 'admin',
                email: emailConfigurado
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        return res.json({
            message: 'Login realizado com sucesso.',
            token
        });

    } catch (error) {
        console.error('Erro no processamento do login:', error.message);
        return res.status(500).json({
            error: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;