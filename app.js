require('colors')
const express = require('express')
const connectDB = require('./connection/db')
const path = require('path')
const methodOverride = require('method-override')
const Campground = require('./models/campground')

const app = express()

connectDB()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
  const newCampground = await Campground(req.body.campground)
  await newCampground.save()
  res.redirect(`/campgrounds/${newCampground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render('campgrounds/show', { campground })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground
  })
  res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
})

const PORT = 3000
app.listen(PORT, () =>
  console.log(`==> Listening on PORT ${PORT} <==`.black.bgCyan)
)
