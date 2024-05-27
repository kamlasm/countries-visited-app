const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
const Country = require('../models/country.js')

router.get('/', async (req, res) => {
    try {
        const countries = await Country.find().sort({'name': 'asc'})
        const mostVisitedCountries = countries.toSorted((a, b) => {
            if (a.visitors.length < b.visitors.length) {
                return 1
            }
            if (a.visitors.length > b.visitors.length) {
                return -1
            }
            return 0
        })

        res.render('community/index.ejs', {countries, mostVisitedCountries,})

    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.get('/:countryId', async (req, res) => {
    try {
        const country = await Country.findById(req.params.countryId).populate('visitors')
        
        country.visitors.forEach(async (visitor) => {
            const user = await User.findById(visitor._id)

        })
        
      
        res.render('community/show.ejs', {country,})
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

module.exports = router