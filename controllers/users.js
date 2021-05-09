const User = require('../models/user');
const House = require('../models/house');
const Wishlist = require('../models/wishlist');

module.exports.renderRegister = (req, res) => {
    res.render('users/signUp');
}

module.exports.register = async(req, res, next) => {
    try {
        const { email, username, password, phone } = req.body;
        const user = new User({ email, username, phone });
        const registeredUser = await User.register(user, password);
        const wishlist = await new Wishlist;
        wishlist.user = registeredUser._id;
        await wishlist.save();
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to ShiftNow');
            res.redirect('/houses');
        })
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('signUp')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnTo || '/houses';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged you out');
    res.redirect('/houses');
}

module.exports.profile = async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const houses = await House.find({ "owner": `${id}` });
    res.render('users/show', { user, houses })
}