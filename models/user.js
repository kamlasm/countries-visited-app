const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    shareData: { type: Boolean, required: true, default: true },
    countriesVisited: [{ type: mongoose.Schema.ObjectId, ref: 'Country'}], 
    visitsMade: [{ type: mongoose.Schema.ObjectId, ref: 'Visit'}],
})

const User = mongoose.model('User', userSchema)

module.exports = User