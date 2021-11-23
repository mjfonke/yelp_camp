
const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const users = require('../controllers/users');
const passport = require('passport');


router.get('/register', users.renderRegister);

// register new user
router.post('/register', users.register);

router.get('/login', users.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);


module.exports = router;