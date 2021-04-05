require('colors')
const express = require('express')
const path = require('path')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())

app.get('/', (req, res) => {
  res.render('home')
})

const PORT = 3000
app.listen(PORT, () =>
  console.log(`==> Listening on PORT ${PORT} <==`.black.bgCyan)
)
