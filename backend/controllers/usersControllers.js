const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

const User = require('../models/usersModel')

// POST /api/users  -> registrar usuario
const crearUser = asyncHandler(async(req, res) => {
    // desestructura del body
    const {name, email, password} = req.body || {}

    // validación de los datos
    if (!name) {
        res.status(400)
        throw new Error ('Favor de teclear el nombre')
    }

    if (!email) {
        res.status(400)
        throw new Error ('Favor de teclear el email')
    }

    if (!password) {
        res.status(400)
        throw new Error ('Favor de teclear el password')
    }

    // verificar que el email no esté relacionado con otro usuario
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error ('Ese email ya está registrado')
    }

    // hash al password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // crear el usuario
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email
        })
    }
})

// POST /api/users/login  -> iniciar sesión y devolver el JWT
const loginUser = asyncHandler(async(req, res) => {
    // desestructura del body
    const {email, password} = req.body || {}

    if (!email || !password) {
        res.status(400)
        throw new Error('Favor de teclear email y password')
    }

    const user = await User.findOne({email})

    // si el usuario existe, verificamos el password
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generarToken(user.id)
        })
    }
    else {
        res.status(401)
        throw new Error('Credenciales incorrectas')
    }
})

// GET /api/users/datos  -> datos del usuario dueño del token
const datosUser = asyncHandler(async(req, res) => {
    // req.user lo llena el middleware protect a partir del token
    res.status(200).json({
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

const generarToken = (id_usuario) => {
    return jwt.sign({id_usuario}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}
module.exports = {
    crearUser, loginUser, datosUser
}