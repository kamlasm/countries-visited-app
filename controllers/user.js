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
    res.render('user/new-country.ejs')
})

router.post('/:userId/new-country', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const country = await Country.findOne({name: `${req.body.countryName}`})

        if (user.countriesVisited.includes(country.id)) {
            throw new Error('You have already logged this country!')
        }

        user.countriesVisited.push(country.id)
        await user.save()
        
        country.visitors.push(user.id)
        await country.save()

        res.redirect(`/user/${req.params.userId}/${country.id}`)
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.get('/:userId/settings', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const shareData = user.shareData
        res.render('user/settings.ejs', {shareData,})
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.put('/:userId/settings', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, {new: true})
        res.redirect(`/user/${req.params.userId}/settings`)
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.delete('/:userId/:countryId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const country = await Country.findById(req.params.countryId)
        const visits = await Visit.find({countryName: `${country._id}`, createdBy: `${user._id}`})
       
        visits.forEach(async (visit) => {
            user.visitsMade.pull(visit._id)
            country.visits.pull(visit._id)
            await visit.deleteOne()
        })

        user.countriesVisited.pull(country._id)
        country.visitors.pull(user._id)
        
        await user.save()
        await country.save()
       
        res.redirect(`/user/${req.params.userId}`)
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.get('/:userId/:countryId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({path: 'countriesVisited'}).populate({path: 'visitsMade'})

        const country = await Country.findById(`${req.params.countryId}`)

        const visits = await Visit.find({countryName: `${country._id}`, createdBy: `${user._id}`}).sort({startDate: 'desc'})

        res.render('user/show.ejs', {country, visits})
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.get('/:userId/:countryId/new-visit', async (req, res) => {
    try {
        const currentCountry = await Country.findById(`${req.params.countryId}`)

        res.render('user/new-visit.ejs', {currentCountry}) 
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }  
})

router.post('/:userId/:countryId/new-visit', async (req, res) => {
    try {
        const country = await Country.findById(`${req.params.countryId}`)
        const user = await User.findById(req.params.userId)

        req.body.countryName = country.id
        req.body.createdBy = user.id

        const newVisit = await Visit.create(req.body)

        user.visitsMade.push(newVisit.id)
        await user.save()
        
        country.visits.push(newVisit.id)
        await country.save()

        res.redirect(`/user/${req.params.userId}/${req.params.countryId}`)
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }  
})

router.get('/:userId/:countryId/:visitId/edit-visit', async (req, res) => {
    try {
        const currentCountry = await Country.findById(`${req.params.countryId}`)
        
        const visit = await Visit.findById(`${req.params.visitId}`)

        const formattedStartDate = convertDate(visit.startDate)
        const formattedEndDate = convertDate(visit.endDate)

        res.render('user/edit-visit.ejs', {currentCountry, visit, startDate: formattedStartDate, endDate: formattedEndDate})
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

router.put('/:userId/:countryId/:visitId/edit-visit', async (req, res) => {
    try {
        const updatedVisit = await Visit.findByIdAndUpdate(req.params.visitId, req.body, {new: true})
        
        res.redirect(`/user/${req.params.userId}/${req.params.countryId}`)  
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }  
})

router.delete('/:userId/:countryId/:visitId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const country = await Country.findById(req.params.countryId)
        const visit = await Visit.findById(req.params.visitId)
        
        user.visitsMade.pull(visit._id)
        await user.save()

        country.visits.pull(visit._id)
        await country.save()

        await visit.deleteOne()
        
        res.redirect(`/user/${req.params.userId}/${req.params.countryId}`)
    } catch (error) {
        res.render('error.ejs', { msg: error.message })
    }
})

module.exports = router