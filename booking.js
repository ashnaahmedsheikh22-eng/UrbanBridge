const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },

    bookingDate: {
        type: Date,
        required: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    notes: {
        type: String,
        default: '',
        trim: true
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)