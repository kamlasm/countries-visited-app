const serverless = require('serverless-http')
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')
const path = require('path')
const MongoStore = require('connect-mongo')

const authController = require('../../controllers/auth.js')
const userController = require('../../controllers/user.js')
const communityController = require('../../controllers/community.js')
const passUserToView = require('../../middleware/pass-user-to-view.js')
const passCountryToView = require('../../middleware/pass-country-to-view.js')

async function connectToDb() {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  
connectToDb()

app.use(express.static('public'))
app.use(express.json()) 
app.use(express.urlencoded({ extended: false })) 
app.use(methodOverride('_method')) 
app.use(morgan('dev')) 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  }),
}))
app.use(passUserToView)
app.use(passCountryToView)

app.use('/auth', authController)
app.use('/user', userController)
app.use('/community', communityController)

app.get('/', (req, res) => {
    res.render('home.ejs', {
    })
  })
  
  app.get("*", (req, res) => {
    res.render('error.ejs', {msg:"Page not found!"})
  })

  module.exports.handler = serverless(app)