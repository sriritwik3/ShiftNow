const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const House = require('./models/house');
const User = require('./models/user');
const Wishlist = require('./models/wishlist');

const houseRoutes = require('./routes/houses');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const { isLoggedIn, isOwner, isOwnerNeg } = require('./middleware');


mongoose.connect('mongodb://localhost:27017/shiftnow', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
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
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
	secret: 'thisshouldbeabettersecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
	if (!['/login', '/'].includes(req.originalUrl)) {
		req.session.returnTO = req.originalUrl;
	}
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})


app.use('/', userRoutes)
app.use('/houses', houseRoutes)
app.use('/houses/:id/reviews', reviewRoutes)




app.get('/', (req, res) => {
	res.render('home')
});



app.get('/profile/wishlist', isLoggedIn, async (req, res) => {
	const wishlist = await Wishlist.find({ "user": `${req.user._id}` });
	if (wishlist.length < 1) {
		req.flash('error', 'No wishlisted houses');
		return res.redirect('/houses')
	} else {
		const houses = await House.find({ '_id': { $in: wishlist[0].home } });
		res.render('users/wishlist', { houses })
	}
})

app.post('/profile/wishlist/:id', isLoggedIn, isOwnerNeg, async (req, res) => {
	const house = await House.findById(req.params.id);
	let wishlist = await Wishlist.find({ "user": `${req.user._id}` });
	if (wishlist.length > 0) {
		wishlist[0].home.push(house)
		await wishlist[0].save();
		req.flash('success', 'Added to wishlist');
		res.redirect('/houses');
	} else {
		wishlist = new Wishlist;
		wishlist.user = req.user._id;
		wishlist.home.push(house)
		await wishlist.save();
		req.flash('success', 'Added to wishlist');
		res.redirect('/houses');
	}
})

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