process.env.NODE_ENV !== 'production' && require('dotenv').config()

require('colors')
const express = require('express')
const connectDB = require('./connection/db')
const path = require('path')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const expressSession = require('express-session')
const ExpressError = require('./utiles/ExpressError')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const app = express()
connectDB()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
app.use(
  expressSession({
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

// make sure passport session is defined after express-session
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

passport.use(new LocalStrategy(User.authenticate()))

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.use('*', (req, res, next) => {
  next(new ExpressError('Page Not Found'), 404)
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

const PORT = 3000
app.listen(PORT, () =>
  console.log(`==> Listening on PORT ${PORT} <==`.black.bgCyan)
)
