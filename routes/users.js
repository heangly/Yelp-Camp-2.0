const express = require('express')
const passport = require('passport')
const catchAsync = require('../utiles/catchAsync')
const user = require('../controllers/users')
const router = express.Router()

router.get('/register', user.renderRegister)

router.post('/register', catchAsync(user.register))

router
  .route('/login')
  .get(user.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login'
    }),
    user.login
  )

router.get('/logout', user.logout)

module.exports = router
