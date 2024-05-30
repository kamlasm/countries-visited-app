const express = require('express')
const router = express.Router()

const Visit = require('../models/visit.js')
const Country = require('../models/country.js')

const isSignedIn = require('../middleware/is-signed-in.js')

router.get('/', isSignedIn, async (req, res) => {
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

router.get('/:countryId', isSignedIn, async (req, res) => {
    try {
        const country = await Country.findById(req.params.countryId).populate({
            path: 'visitors',
            match: { shareData: true },
            select: 'username',
        })
        const visitorsDataOn = country.visitors.sort((a, b) => {
            if (a.username < b.username) {
                return -1
            }
            if (a.username > b.username) {
                return 1
            }
            return 0
        })

        const visits = await Visit.find({countryName: `${country._id}`}).populate({
            path: 'createdBy',
            match: { shareData: true },
            select: 'username'
        })

        const visitsDataOn = visits.filter(visit => {
            return visit.createdBy
        }).sort((a, b) => {
            if (a.createdBy.username < b.createdBy.username) {
                return -1
            }
            if (a.createdBy.username > b.createdBy.username) {
                return 1
            }
            return 0
        })

        res.render('community/show.ejs', {country, visitorsDataOn, visitsDataOn})
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

module.exports = router