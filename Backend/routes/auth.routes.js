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

        // ========================================
        // DIAGNÓSTICO
        // ========================================

        const emailRecebido = email.trim().toLowerCase();

        const emailConfigurado =
            process.env.ADMIN_EMAIL
                ?.trim()
                .toLowerCase();

        console.log('\n===== TESTE DE LOGIN =====');

        console.log(
            'E-mails são iguais:',
            emailRecebido === emailConfigurado
        );

        console.log(
            'ADMIN_EMAIL existe:',
            Boolean(process.env.ADMIN_EMAIL)
        );

        console.log(
            'ADMIN_PASSWORD_HASH existe:',
            Boolean(process.env.ADMIN_PASSWORD_HASH)
        );

        console.log(
            'JWT_SECRET existe:',
            Boolean(process.env.JWT_SECRET)
        );

        // ========================================
        // VALIDAR EMAIL
        // ========================================

        if (emailRecebido !== emailConfigurado) {

            console.log(
                'LOGIN NEGADO: e-mail diferente.'
            );

            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        // ========================================
        // VALIDAR SENHA
        // ========================================

        const senhaCorreta =
            await bcrypt.compare(
                senha,
                process.env.ADMIN_PASSWORD_HASH
            );

        console.log(
            'Senha corresponde ao hash:',
            senhaCorreta
        );

        if (!senhaCorreta) {

            console.log(
                'LOGIN NEGADO: senha não corresponde ao hash.'
            );

            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        // ========================================
        // GERAR JWT
        // ========================================

        const token = jwt.sign(
            {
                role: 'admin'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        console.log(
            'LOGIN REALIZADO COM SUCESSO.'
        );

        console.log(
            '==========================\n'
        );

        return res.json({
            message: 'Login realizado com sucesso.',
            token
        });

    } catch (error) {

        console.error(
            'Erro no login:',
            error
        );

        return res.status(500).json({
            error: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;