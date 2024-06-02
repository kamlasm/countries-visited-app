const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user.js')

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username })
        if (userInDatabase) {
        throw new Error('Username already taken. Please try a different username.')
        }

        if (req.body.password !== req.body.confirmPassword) {
            throw new Error('Passwords don\'t match. Please try again.')
        }

        const hasUpperCase = /[A-Z]/.test(req.body.password)
        if (!hasUpperCase) {
            throw new Error('Password must contain at least one uppercase letter')
        }
    
        if (req.body.password.length < 6) {
            throw new Error('Password must be at least 6 characters long.')
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        req.body.password = hashedPassword
    
        const user = await User.create(req.body)

        req.session.user = { 
            username: user.username,
            userId: user._id
        }
        
        req.session.save(() => {
            res.redirect(`/user/${user.id}`)  
        })
    
    } catch (error) {
        res.render('auth/sign-up.ejs', { msg: error.message })
    }
  })

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })

        if (!user) {
            throw new Error('Login failed. Please try again.')
        }
    
        const validPassword = bcrypt.compareSync(req.body.password, user.password) 
    
        if (!validPassword) {
            throw new Error('Login failed. Please try again.')
        }

        req.session.user = {
            username: user.username,
            userId: user._id
        }

        req.session.save(() => {
            res.redirect(`/user/${user.id}`)           
        })

    } catch (error) {
        res.render('auth/sign-in.ejs', { msg: error.message })
    }
})

router.get('/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

module.exports = router