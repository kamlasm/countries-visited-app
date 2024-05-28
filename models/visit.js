const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema({
    countryName: { type: mongoose.Schema.ObjectId, ref: 'Country', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    highlights: { type: String, required: false },
    travellerTips: { type: String, required: false },
    images: [{ type: String, required: false }],
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
})

const Visit = mongoose.model('Visit', visitSchema)

module.exports = Visit