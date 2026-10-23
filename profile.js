
const mongoose = require('mongoose')

const providerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    skills: [{
        type: String,
        required: true,
        trim: true
    }],

    experience: {
        type: Number,
        required: true,
        min: 0
    },

    charges: {
        type: Number,
        required: true,
        min: 0
    },

    description: {
        type: String,
        default: ''
    },

    isAvailable: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })



module.exports = mongoose.model(
    'ProviderProfile',
    providerProfileSchema
)

