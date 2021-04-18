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
      image: 'https://source.unsplash.com/collection/483251',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem, similique. Hic vel cupiditate sint, quos quasi corrupti facilis doloremque quo omnis cum totam animi illo perspiciatis architecto deleniti. Aliquam fugit ratione obcaecati at quam distinctio repudiandae assumenda asperiores non laudantium, illum facilis aliquid ipsum odit expedita ex maxime praesentium. Veritatis.',
      price
    })
    await camp.save()
  }
}

seedDB().then(() => {
  console.log('==> Data Seeded <=='.black.bgGreen)
  mongoose.connection.close()
})
