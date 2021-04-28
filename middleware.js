const House = require('./models/house');
const Review = require('./models/review');

const ExpressError = require('./utils/ExpressError');
const { houseSchema, reviewSchema } = require('./schemas.js');




module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}


module.exports.validateHouse = (req, res, next) => {
    const { error } = houseSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const house = await House.findByIdAndUpdate(id);
    if (!house.owner.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do this');
        return res.redirect(`/houses/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findByIdAndUpdate(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do this');
        return res.redirect(`/houses/${id}`)
    }
    next();
}