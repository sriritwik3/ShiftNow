const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const House = require('../models/house');
const { houseSchema } = require('../schemas.js');




const validateHouse = (req, res, next) => {
	const { error } = houseSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}




router.get('/', catchAsync(async (req, res) => {
	const houses = await House.find({});
	res.render('houses/index', { houses })
}));

router.get('/new', (req, res) => {
	res.render('houses/new')
});

router.post('/', validateHouse, catchAsync(async (req, res, next) => {
	// if (!req.body.house) throw new ExpressError('Invalid House Data', 400);
	const house = new House(req.body.house);
	await house.save();
	req.flash('success', 'Successfully added a new property');
	res.redirect(`/houses/${house._id}`)

}));

router.get('/:id', catchAsync(async (req, res) => {
	const house = await House.findById(req.params.id).populate('reviews');
	if(!house){
		req.flash('error', 'Cannot find the property');
		res.redirect('/houses');
	}
	res.render('houses/show', { house })
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
	const house = await House.findById(req.params.id)
	if(!house){
		req.flash('error', 'Cannot find the property');
		res.redirect('/houses');
	}
	res.render('houses/edit', { house })
}));

router.put('/:id', validateHouse, catchAsync(async (req, res) => {
	const { id } = req.params;
	const house = await House.findByIdAndUpdate(id, { ...req.body.house });
	req.flash('success', 'Successfully updated the property details');
	res.redirect(`/houses/${house._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
	const { id } = req.params;
	await House.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted a property');
	res.redirect('/houses');
}));


module.exports = router;