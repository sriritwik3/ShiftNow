const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');

const House = require('../models/house');

const { isLoggedIn, validateHouse, isOwner } = require('../middleware');



router.get('/', catchAsync(async (req, res) => {
	const houses = await House.find({});
	res.render('houses/index', { houses })
}));

router.get('/new', isLoggedIn, (req, res) => {
	res.render('houses/new')
});

router.post('/', isLoggedIn, validateHouse, catchAsync(async (req, res, next) => {
	const house = new House(req.body.house);
	house.owner = req.user._id;
	await house.save();
	req.flash('success', 'Successfully added a new property');
	res.redirect(`/houses/${house._id}`)

}));

router.get('/:id', catchAsync(async (req, res) => {
	const house = await House.findById(req.params.id).populate({
		path: 'reviews',
		populate: {
			path: 'author'
		}
	}).populate('owner');
	if (!house) {
		req.flash('error', 'Cannot find the property');
		res.redirect('/houses');
	}
	res.render('houses/show', { house })
}));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async (req, res) => {
	const { id } = req.params;
	const house = await House.findById(id)
	if (!house) {
		req.flash('error', 'Cannot find the property');
		res.redirect('/houses');
	}
	res.render('houses/edit', { house })
}));

router.put('/:id', isLoggedIn, isOwner, validateHouse, catchAsync(async (req, res) => {
	const { id } = req.params;
	const house = await House.findByIdAndUpdate(id, { ...req.body.house });
	req.flash('success', 'Successfully updated the property details');
	res.redirect(`/houses/${house._id}`)
}));

router.delete('/:id', isLoggedIn, isOwner, catchAsync(async (req, res) => {
	const { id } = req.params;
	await House.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted a property');
	res.redirect('/houses');
}));


module.exports = router;