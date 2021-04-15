const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    console.log('DB connected successful'.black.bgGreen)
  } catch (err) {
    console.log('DB connected failed'.black.bgRed)
    console.log(err)
  }
}

module.exports = connectDB
