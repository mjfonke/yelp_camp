const express = require('express');
const router = express.Router({ mergeParams: true });
// When you make separate routes folder, make mergeParams:true to be able to grab req.params correctly

const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');


router.route('/')
    .get(reviews.renderReview)
    .post(isLoggedIn, validateReview, catchAsync(reviews.createReview))


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;