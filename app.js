require('colors')
const express = require('express')
const connectDB = require('./connection/db')
const path = require('path')
const Campground = require('./models/campground')

const app = express()

connectDB()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

const PORT = 3000
app.listen(PORT, () =>
  console.log(`==> Listening on PORT ${PORT} <==`.black.bgCyan)
)