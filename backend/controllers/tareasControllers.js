const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const Tarea = require('../models/tareasModel')

// Busca una tarea por su id SOLO si pertenece al usuario del token.
// Si no existe o es de otro usuario, responde 404 y la tarea no se toca.
const buscarTareaPropia = async (req, res) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        res.status(404)
        throw new Error('La tarea especificada no se encuentra.')
    }

    const tarea = await Tarea.findOne({ _id: id, user: req.user.id })

    if (!tarea) {
        res.status(404)
        throw new Error('La tarea no existe o no te pertenece.')
    }

    return tarea
}

// GET /api/tareas  -> solo las tareas del usuario logueado
const getTareas = asyncHandler(async(req, res) => {
    const tareas = await Tarea.find({ user: req.user.id })
    res.status(200).json(tareas)
})

// POST /api/tareas  -> la tarea se asigna al usuario del token
const createTareas = asyncHandler(async(req, res) => {
    const descripcion = req.body?.descripcion

    if (!descripcion) {
        res.status(400)
        throw new Error('Por favor inserta la descripción.')
    }

    const tarea = await Tarea.create({
        user: req.user.id,   // el id sale del token, nunca del body
        descripcion
    })

    res.status(201).json(tarea)
})

// PUT /api/tareas/:id  -> solo si la tarea es del usuario del token
const updateTareas = asyncHandler(async(req, res) => {
    const descripcion = req.body?.descripcion

    if (!descripcion) {
        res.status(400)
        throw new Error('Por favor inserta la nueva descripción.')
    }

    const tarea = await buscarTareaPropia(req, res)
    tarea.descripcion = descripcion
    const tareaUpdated = await tarea.save()

    res.status(200).json(tareaUpdated)
})

// DELETE /api/tareas/:id  -> solo si la tarea es del usuario del token
const deleteTareas = asyncHandler(async(req, res) => {
    const tarea = await buscarTareaPropia(req, res)
    await tarea.deleteOne()

    res.status(200).json({ id: req.params.id, message: 'Tarea eliminada' })
})

module.exports = { getTareas, createTareas, updateTareas, deleteTareas }
