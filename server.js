require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
// const session = require('session')
// const path = require('path')
const MongoStore = require('connect-mongo')

// const authController = require('./controllers/auth.js')
// const userController = require('./controllers/user.js')
// const communityController = require('./controllers/community.js')
// const passUserToView = require('./middleware/pass-user-to-view.js')

const port = process.env.PORT ? process.env.PORT : 3000

mongoose.connect(process.env.MONGODB_URI)

// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json()) 
app.use(express.urlencoded({ extended: false })) 
app.use(methodOverride('_method')) 
app.use(morgan('dev')) 
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI,
//   }),
// }))
// app.use(passUserToView)

// app.use('/auth', authController)
// app.use('/user', userController)
// app.use('/community', communityController)

app.get('/', (req, res) => {
    res.render('home.ejs', {
    })
  })
  
  app.get("*", (req, res) => {
    res.send("Page not found!")
  })

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})