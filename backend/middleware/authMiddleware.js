const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

// Valida el header "Authorization: Bearer <token>".
// Sin token o con token inválido/alterado responde 401 Unauthorized.
const protect = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // el usuario se identifica con el id que viene dentro del token
            req.user = await User.findById(decoded.id_usuario).select('-password')
        } catch (error) {
            res.status(401)
            throw new Error('Acceso no autorizado, token inválido')
        }

        if (!req.user) {
            res.status(401)
            throw new Error('Acceso no autorizado, usuario no encontrado')
        }
        return next()
    }

    res.status(401)
    throw new Error('Acceso no autorizado, no proporcionaste un token')
})

module.exports = protect
