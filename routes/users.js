
const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const passport = require('passport');



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
        // to automatically log the new users in after they register, use passport.js req.login() function
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })


    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    // to reset seesion.returnTo for next users
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out. Good Bye!');
    res.redirect('/campgrounds');
})


module.exports = router;