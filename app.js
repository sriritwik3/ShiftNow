const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const House = require('./models/house');
const ejsMate = require('ejs-mate');
const { houseSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');


mongoose.connect('mongodb://localhost:27017/shiftnow', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
	console.log("Database connected!!!!");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateHouse = (req, res, next) => {
	const { error } = houseSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

app.get('/', (req, res) => {
	res.render('home')
});

app.get('/houses', catchAsync(async (req, res) => {
	const houses = await House.find({});
	res.render('houses/index', { houses })
}));

app.get('/houses/new', (req, res) => {
	res.render('houses/new')
});

app.post('/houses', validateHouse, catchAsync(async (req, res, next) => {
	// if (!req.body.house) throw new ExpressError('Invalid House Data', 400);
	const house = new House(req.body.house);
	await house.save();
	res.redirect(`/houses/${house._id}`)

}))

app.get('/houses/:id', catchAsync(async (req, res) => {
	const house = await House.findById(req.params.id).populate('reviews');
	let totalRating = 0;
	let count = 0;
	for(let rat of house.reviews){
		totalRating = totalRating + rat.rating;
		count = count + 1;
	}
	res.render('houses/show', { house, totalRating, count })
}));

app.get('/houses/:id/edit', catchAsync(async (req, res) => {
	const house = await House.findById(req.params.id)
	res.render('houses/edit', { house })
}));

app.put('/houses/:id', validateHouse, catchAsync(async (req, res) => {
	const { id } = req.params;
	const house = await House.findByIdAndUpdate(id, { ...req.body.house });
	res.redirect(`/houses/${house._id}`)
}));

app.delete('/houses/:id', catchAsync(async (req, res) => {
	const { id } = req.params;
	await House.findByIdAndDelete(id);
	res.redirect('/houses');
}));

app.post('/houses/:id/reviews', validateReview, catchAsync(async (req, res) => {
	const house = await House.findById(req.params.id);
	const review = new Review(req.body.review);
	house.reviews.push(review);
	await review.save();
	await house.save();
	res.redirect(`/houses/${house._id}`);
}));

app.delete('/houses/:id/reviews/:reviewId', catchAsync(async (req, res) => {
	const { id, reviewId } = req.params;
	await House.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	res.redirect(`/houses/${id}`);
}))

app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong'
	res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
	console.log("Serving on port 3000!!!")
})