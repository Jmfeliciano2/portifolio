const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                error: 'Informe e-mail e senha.'
            });
        }

        const emailCorreto =
            email === process.env.ADMIN_EMAIL;

        if (!emailCorreto) {
            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        const senhaCorreta = await bcrypt.compare(
            senha,
            process.env.ADMIN_PASSWORD_HASH
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        const token = jwt.sign(
            {
                role: 'admin'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        res.json({
            message: 'Login realizado com sucesso.',
            token
        });

    } catch (error) {
        console.error('Erro no login:', error);

        res.status(500).json({
            error: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;