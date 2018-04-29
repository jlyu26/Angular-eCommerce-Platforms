// This file holds all account related routes

const router = require('express').Router();
const jwt = require('jsonwebtoken');	// JWT: JSON Web Token

const User = require('../models/user');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwt');


// Authentication APIs: `/signup`, `/login`

router.post('/signup', (req, res, next) => {	// post: send data to server
	let user = new User();
	user.name = req.body.name;
	user.email = req.body.email;
	user.password = req.body.password;
	user.picture = user.gravatar();
	user.isSeller = req.body.isSeller;

	User.findOne({ email: req.body.email }, (err, existingUser) => {
		if (existingUser) {	
			res.json({
				success: false,
				message: 'Account with that email already in use'
			});

		} else {			
			user.save();
			
			var token = jwt.sign({
				user: user
			}, config.secret, {
				expiresIn: '7d'
			});

			res.json({
				success: true,
				message: 'here is your token',
				token: token
			})
		}
	});
});

router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) { throw err };

		if (!user) {
			res.json({
				success: false,
				message: 'User not found'
			});

		} else if (user) {
			var validPassword = user.comparePassword(req.body.password);
			if (!validPassword) {
				res.json({
					success: false,
					message: 'Password does not match' 
				});

			} else {
				var token = jwt.sign({
					user: user
				}, config.secret, {
					expiresIn: '7d'
				});
				
				res.json({
					success: true,
					message: 'here is your token',
					token: token
				});
			}
		}
	});
});



// Profile and Address APIs:

// router.get('/profile');
// router.post('/profile');
// which equals to: chain method

router.route('/profile')
	.get(checkJWT, (req, res, next) => {	// run checkJWT brfore proceed the arrow function
		User.findOne({ _id: req.decoded.user._id }, (err, user) => {
			res.json({
				success: true,
				user: user,
				message: 'successful'
			});
		});
	})
	.post(checkJWT, (req, res, next) => {
		User.findOne({ _id: req.decoded.user._id }, (err, user) => {
			if (err) { return next(err); }

			if (req.body.name) { user.name = req.body.name; }
			if (req.body.email) { user.email = req.body.email; }
			if (req.body.password) { user.password = req.body.password; }

			user.isSeller = req.body.isSeller;

			user.save();
			res.json({
				success: true,
				message: 'profile updated successfully'
			});
		});
	});

	router.route('/address')
		.get(checkJWT, (req, res, next) => {	// run checkJWT brfore proceed the arrow function
			User.findOne({ _id: req.decoded.user._id }, (err, user) => {
				res.json({
					success: true,
					address: user.address,
					message: 'successful'
				});
			});
		})
		.post(checkJWT, (req, res, next) => {
			User.findOne({ _id: req.decoded.user._id }, (err, user) => {
				if (err) { return next(err); }

				if (req.body.addr1) { user.address.addr1 = req.body.addr1; }
				if (req.body.addr2) { user.address.addr2 = req.body.addr2; }
				if (req.body.city) { user.address.city = req.body.city; }
				if (req.body.state) { user.address.state = req.body.state; }
				if (req.body.country) { user.address.country = req.body.country; }
				if (req.body.postalCode) { user.address.postalCode = req.body.postalCode; }

				user.save();
				res.json({
					success: true,
					message: 'address updated successfully'
				});
			});
		});



module.exports = router;