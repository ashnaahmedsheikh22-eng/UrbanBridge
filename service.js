const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    charges: {
        type: Number,
        required: true,
        min: 0
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    isAvailable: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

module.exports = mongoose.model('Service', serviceSchema)

