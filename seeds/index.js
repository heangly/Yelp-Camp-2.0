const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')
require('colors')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      author: '607ad2f9bbe93209410bb1b4',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url:
            'https://res.cloudinary.com/dqwzvpxep/image/upload/v1618921429/YelpCamp/hdtzilvck2f95o1tw62z.jpg',
          filename: 'YelpCamp/hdtzilvck2f95o1tw62z'
        },
        {
          url:
            'https://res.cloudinary.com/dqwzvpxep/image/upload/v1618921429/YelpCamp/nfprkzp0ec839cujlm9s.png',
          filename: 'YelpCamp/nfprkzp0ec839cujlm9s'
        }
      ],
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, similique.',
      price
    })
    await camp.save()
  }
}

seedDB().then(() => {
  console.log('==> Data Seeded <=='.black.bgGreen)
  mongoose.connection.close()
})
