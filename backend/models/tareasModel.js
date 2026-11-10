const mongoose = require ('mongoose')

const TareasSchema = mongoose.Schema({
    descripcion: {
        type: String,
        required: [true, 'Por favor inserta una descripción.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Tarea', TareasSchema)