const express = require('express')
const catchAsync = require('../utiles/catchAsync')
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const router = express.Router()

router
  .route('/')
  .get(
    catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({})
      res.render('campgrounds/index', { campgrounds })
    })
  )
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
      const newCampground = await Campground(req.body.campground)
      newCampground.author = req.user._id
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
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
      req.flash('error', 'Cannot find that campground')
      return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
  })
)

router
  .route('/:id')
  .get(
    catchAsync(async (req, res) => {
      const { id } = req.params
      const campground = await Campground.findById(id)
        .populate({
          path: 'reviews',
          populate: {
            path: 'author'
          }
        })
        .populate('author')

      if (!campground) {
        req.flash('error', 'Cannot find that campground')
        res.redirect('/campgrounds')
      } else {
        res.render('campgrounds/show', { campground })
      }
    })
  )
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(async (req, res) => {
      const { id } = req.params
      const campground = await Campground.findById(id)
      await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
      })
      req.flash('success', 'Successfully updated campground')
      res.redirect(`/campgrounds/${campground._id}`)
    })
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
      const { id } = req.params
      await Campground.findByIdAndDelete(id)
      req.flash('success', 'Successfully Deleted Campground')
      res.redirect('/campgrounds')
    })
  )

module.exports = router
