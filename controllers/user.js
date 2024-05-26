const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
const Country = require('../models/country.js')

router.get('/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId).populate({path: 'countriesVisited', populate: {path: 'countryName'}})
    const userCountries = user.countriesVisited
    res.render('user/index.ejs', {userCountries,})
})

router.get('/:userId/new-country', (req,res) => {
    res.render('user/new.ejs')
})

router.post('/:userId/new-country', async (req, res) => {
    const user = await User.findById(req.params.userId)
    const country = await Country.findOne({name: `${req.body.countryName}`})
    req.body.countryName = country.id
    user.countriesVisited.push(req.body)
    await user.save()
    res.redirect(`/user/${req.params.userId}`)
})

router.delete('/:userId/:visitId', async (req, res) => {
    const user = await User.findById(req.params.userId)
    const country = user.countriesVisited.id(req.params.visitId)
    country.deleteOne()
    await user.save()
    res.redirect(`/user/${req.params.userId}`)
})

router.get('/:userId/:visitId', async (req, res) => {
    const user = await User.findById(req.params.userId).populate({path: 'countriesVisited', populate: {path: 'countryName'}})
    const userCountry = user.countriesVisited.id(req.params.visitId)
    res.render('user/show.ejs', {userCountry,})
})

module.exports = router