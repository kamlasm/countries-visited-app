const mongoose = require('mongoose')

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    territory: { type: Boolean, required: true, default: false}
})

const Country = mongoose.model('Country', countrySchema)

module.exports = Country