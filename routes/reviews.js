const express = require('express');
const router = express.Router({ mergeParams: true });
// When you make separate routes folder, make mergeParams:true to be able to grab req.params correctly
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');



router.get('/', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.redirect(`/campgrounds/${campground._id}`);
});

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created new review!');
    res.redirect(`/campgrounds/${campground._id}`);

}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully Deleted review!');
    res.redirect(`/campgrounds/${id}`)
}));

module.exports = router;