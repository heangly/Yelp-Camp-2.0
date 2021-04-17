const express = require('express')
const catchAsync = require('../utiles/catchAsync')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')
const Review = require('../models/review')
const ExpressError = require('../utiles/ExpressError')
const { isLoggedIn } = require('../middleware')
const router = express.Router()

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)

  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

router
  .route('/')
  .get(
    catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({})
      res.render('campgrounds/index', { campgrounds })
    })
  )
  .post(
    validateCampground,
    catchAsync(async (req, res, next) => {
      const newCampground = await Campground(req.body.campground)
      await newCampground.save()
      req.flash('success', 'Successfully made a new campground!')
      res.redirect(`/campgrounds/${newCampground._id}`)
    })
  )

router.get(
  '/new',
  isLoggedIn,
  catchAsync((req, res) => {
    res.render('campgrounds/new')
  })
)

router.get(
  '/:id/edit',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
      req.flash('error', 'Cannot find that campground')
      res.redirect('/campgrounds')
    } else {
      res.render('campgrounds/edit', { campground })
    }
  })
)

router
  .route('/:id')
  .get(
    isLoggedIn,
    catchAsync(async (req, res) => {
      const { id } = req.params
      const campground = await Campground.findById(id).populate('reviews')
      if (!campground) {
        req.flash('error', 'Cannot find that campground')
        res.redirect('/campgrounds')
      } else {
        res.render('campgrounds/show', { campground })
      }
    })
  )
  .put(
    validateCampground,
    isLoggedIn,
    catchAsync(async (req, res) => {
      const { id } = req.params
      const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
      })
      if (!campground) {
        req.flash('error', 'Cannot find that campground')
        res.redirect('/campgrounds')
      } else {
        req.flash('success', 'Successfully updated campground')
        res.redirect(`/campgrounds/${campground._id}`)
      }
    })
  )
  .delete(
    isLoggedIn,
    catchAsync(async (req, res) => {
      const { id } = req.params
      await Campground.findByIdAndDelete(id)
      req.flash('success', 'Successfully Deleted Campground')
      res.redirect('/campgrounds')
    })
  )

module.exports = router
