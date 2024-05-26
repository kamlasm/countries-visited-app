const Country = require("../models/country")

const passCountryToView = async (req, res, next) => {
    res.locals.country = await Country.find().sort({ name: 'asc'})
    next()
}

module.exports = passCountryToView