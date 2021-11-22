const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const catchAsync = require('../utils/catchAsync');



router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

router.get('/new', isLoggedIn, (req, res) => {

    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {

    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)

}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const { id } = req.params;
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a new campground!');
    res.redirect('/campgrounds');
}));




module.exports = router;