const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const House = require('../models/house');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');



const users = require('../controllers/users');


router.route('/signUp')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout)


router.get('/users/:id', isLoggedIn, users.profile);


module.exports = router;