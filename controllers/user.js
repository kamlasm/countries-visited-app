const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
const Country = require('../models/country.js')
const Visit = require('../models/visit.js')

function convertDate(date) {
    const d = String(date.getDate()).padStart(2, '0')
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const y = date.getFullYear()
    return y + '-' + m + '-' + d
}

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({path: 'countriesVisited'})
        const userCountries = user.countriesVisited
        userCountries.sort((a, b) => {
            if (a.name < b.name) {
                return -1
            }
            if (a.name > b.name) {
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
        req.body.createdBy = user.id

        const newVisit = await Visit.create(req.body)

        user.countriesVisited.push(country.id)
        user.visitsMade.push(newVisit.id)
        await user.save()
        
        country.visitors.push(user.id)
        country.visits.push(newVisit.id)
        await country.save()

        res.redirect(`/user/${req.params.userId}`)
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.delete('/:userId/:countryId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const country = await Country.findById(req.params.countryId)
        const visit = await Visit.findOne({countryName: `${country._id}`, createdBy: `${user._id}`})
        
        user.countriesVisited.pull(country._id)
        user.visitsMade.pull(visit._id)
        await user.save()
        console.log(user)     

        country.visitors.pull(user._id)
        country.visits.pull(visit._id)
        await country.save()
        console.log(country)

        await visit.deleteOne()
        
        res.redirect(`/user/${req.params.userId}`)
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.get('/:userId/:countryId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({path: 'countriesVisited'}).populate({path: 'visitsMade'})

        const country = await Country.findById(`${req.params.countryId}`)

        const visit = await Visit.findOne({countryName: `${country._id}`, createdBy: `${user._id}`})

        res.render('user/show.ejs', {user, country, visit})
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.get('/:userId/:countryId/:visitId/edit', async (req, res) => {
    try {
        const currentCountry = await Country.findById(`${req.params.countryId}`)
        
        const visit = await Visit.findById(`${req.params.visitId}`)
        
        let formattedStartDate
        let formattedEndDate
        if (visit.startDate) {
            formattedStartDate = convertDate(visit.startDate)
        } else {
            formattedStartDate = visit.startDate
        }

        if (visit.endDate) {
            formattedEndDate = convertDate(visit.endDate)
        } else {
            formattedEndDate = visit.endDate
        }
    
        res.render('user/edit.ejs', {currentCountry, visit, startDate: formattedStartDate, endDate: formattedEndDate})
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.put('/:userId/:countryId/:visitId/edit', async (req, res) => {
    try {
        const updatedVisit = await Visit.findByIdAndUpdate(req.params.visitId, req.body, {new: true})
        
        res.redirect(`/user/${req.params.userId}/${req.params.countryId}`)  
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }  
})

module.exports = router