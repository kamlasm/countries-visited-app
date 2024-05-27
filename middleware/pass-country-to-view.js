const Country = require("../models/country")

const passCountryToView = async (req, res, next) => {
    res.locals.allCountries = await Country.find().sort({ name: 'asc'})
    next()
}

module.exports = passCountryToView