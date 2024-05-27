const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
const Country = require('../models/country.js')

function convertDate(date) {
    const d = String(date.getDate()).padStart(2, '0')
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const y = date.getFullYear()
    return y + '-' + m + '-' + d
}

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({path: 'countriesVisited', populate: {path: 'countryName'}})
        const userCountries = user.countriesVisited

        userCountries.sort((a, b) => {
            if (a.countryName.name < b.countryName.name) {
                return -1
            }
            if (a.countryName.name > b.countryName.name) {
                return 1
            }
            return 0
        })
        res.render('user/index.ejs', {userCountries,})
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.get('/:userId/new-country', (req,res) => {
    res.render('user/new.ejs')
})

router.post('/:userId/new-country', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const country = await Country.findOne({name: `${req.body.countryName}`})
        req.body.countryName = country.id
        
        user.countriesVisited.push(req.body)
        await user.save()
        
        country.visitors.push(req.params.userId)
        await country.save()
        
        res.redirect(`/user/${req.params.userId}`)
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.delete('/:userId/:visitId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const userCountry = user.countriesVisited.id(req.params.visitId)
        userCountry.deleteOne()
        await user.save()
        
        const country = await Country.findById(userCountry.countryName)
        country.visitors.pull(req.params.userId)
        await country.save()
        
        res.redirect(`/user/${req.params.userId}`)
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.get('/:userId/:visitId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({path: 'countriesVisited', populate: {path: 'countryName'}})
        const userCountry = user.countriesVisited.id(req.params.visitId)
        console.log(userCountry.countryName)
        res.render('user/show.ejs', {userCountry,})
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.get('/:userId/:visitId/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({path: 'countriesVisited', populate: {path: 'countryName'}})
        const userCountry = user.countriesVisited.id(req.params.visitId)
        const formattedStartDate = convertDate(userCountry.startDate)
        const formattedEndDate = convertDate(userCountry.endDate)
        res.render('user/edit.ejs', {userCountry, startDate: formattedStartDate, endDate: formattedEndDate})
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.put('/:userId/:visitId/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const userCountry = user.countriesVisited.id(req.params.visitId)
        userCountry.set(req.body)
        await user.save()
        res.redirect(`/user/${req.params.userId}/${req.params.visitId}`)  
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }  
})

module.exports = router