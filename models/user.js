const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema({
    countryName: { type: mongoose.Schema.ObjectId, ref: 'Country', required: true },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    highlights: { type: String, required: false },
    travellerTips: { type: String, required: false },
    images: [{ type: String, required: false }]
})

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    shareData: { type: Boolean, required: true, default: true },
    countriesVisited: [visitSchema]  
})

const User = mongoose.model('User', userSchema)

module.exports = User