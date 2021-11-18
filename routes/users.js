
const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');


router.get('/register', (req, res) => {
    res.render('users/register');
});

// register new user
router.post('/register', async (req, res) => {
    try {

        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        console.log(registerUser);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

})

module.exports = router;