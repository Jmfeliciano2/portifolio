const jwt = require('jsonwebtoken');

function autenticarAdmin(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            error: 'Acesso não autorizado. Token não fornecido.'
        });
    }

    const partes = authorization.trim().split(/\s+/);

    if (partes.length !== 2 || partes[0] !== 'Bearer' || !partes[1]) {
        return res.status(401).json({
            error: 'Token inválido. Formato esperado: Bearer <token>'
        });
    }

    const token = partes[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded || decoded.role !== 'admin') {
            return res.status(403).json({
                error: 'Acesso negado. Permissão insuficiente.'
            });
        }

        req.admin = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido ou expirado.'
        });
    }
}

module.exports = autenticarAdmin;