const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const House = require('../models/house');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');


router.get('/signUp', (req, res) => {
    res.render('users/signUp');
});

router.post('/signUp', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password, phone } = req.body;
        const user = new User({ email, username, phone });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to ShiftNow');
            res.redirect('/houses');
        })
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('signUp')
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnTo || '/houses';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged you out');
    res.redirect('/houses');
})


router.get('/users/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(id)
    const houses = await House.find({ "owner": `${id}` });
    console.log(houses);
    res.render('users/show', { user, houses })
});


module.exports = router;