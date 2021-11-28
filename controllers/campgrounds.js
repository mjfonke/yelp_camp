const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};

module.exports.renderNewForm = (req, res) => {

    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    res.send(geoData.body.features[0].geometry.coordinates);

    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // const campground = new Campground(req.body.campground);
    // campground.image.url = req.file.path;
    // campground.image.filename = req.file.filename;
    // campground.author = req.user._id;
    // await campground.save();
    // console.log(`NEW CAMPGROUND!! ${campground}`)
    // req.flash('success', 'Successfully made a new campground!');
    // res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit', { campground });
};

module.exports.updateEditForm = async (req, res, next) => {

    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    campground.image.url = req.file.path;
    campground.image.filename = req.file.filename;
    await campground.save();
    req.flash('success', 'Successfully updated a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a new campground!');
    res.redirect('/campgrounds');
};