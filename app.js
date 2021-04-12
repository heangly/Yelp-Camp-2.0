require('colors')
const express = require('express')
const connectDB = require('./connection/db')
const path = require('path')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground')
const catchAsync = require('./utiles/catchAsync')
const ExpressError = require('./utiles/ExpressError')

const app = express()

connectDB()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.render('home')
})

app.get(
  '/campgrounds',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
  })
)

app.get(
  '/campgrounds/new',
  catchAsync((req, res) => {
    res.render('campgrounds/new')
  })
)

app.post(
  '/campgrounds',
  catchAsync(async (req, res, next) => {
    if (!req.body.campground)
      throw new ExpressError('Invalid Campground Data', 400)
    const newCampground = await Campground(req.body.campground)
    await newCampground.save()
    res.redirect(`/campgrounds/${newCampground._id}`)
  })
)

app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', { campground })
  })
)

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
  })
)

app.put(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground
    })
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
  })
)

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
