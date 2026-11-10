// Manejador central de errores: responde siempre en JSON con el status correcto
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

    res.status(statusCode)
    res.json({
        message: err.message,
        // el stack solo se muestra si NODE_ENV=development (útil para depurar)
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
}

module.exports = errorHandler
