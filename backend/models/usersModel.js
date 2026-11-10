const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor teclea el nombre del usuario']
    },
    email: {
        type: String,
        required: [true, 'Por favor teclea el email del usuario'],
        unique: true
    },
     password: {
        type: String,
        required: [true, 'Por favor teclea el password del usuario'],
    },
    esAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)