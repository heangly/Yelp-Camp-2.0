const express = require('express')
const catchAsync = require('../utiles/catchAsync')
const review = require('../controllers/reviews')
const router = express.Router({ mergeParams: true })
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview))

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(review.deleteReview)
)

module.exports = router
