const jwt = require('jsonwebtoken');

function autenticarAdmin(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            error: 'Acesso não autorizado.'
        });
    }

    const [tipo, token] = authorization.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            error: 'Token inválido.'
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido ou expirado.'
        });
    }
}

module.exports = autenticarAdmin;