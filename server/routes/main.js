// This file holds all product and category related routes

const router = require('express').Router();
const async = require('async');	// product loading pagination

const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');

const checkJWT = require('../middlewares/check-jwt');

// get all products
router.get('/products', (req, res, next) => {
	const perPage = 10;
	const page = req.query.page;
	async.parallel([
		function(callback) {
			Product.count({}, (err, count) => {
				let totalProducts = count;
				callback(err, totalProducts);
			});
		},
		function(callback) {
			Product.find({})
				.skip(perPage * page)
				.limit(perPage)
				.populate('category')
				.populate('owner')
				.exec((err, products) => {
					if (err) { return next(err); }
					callback(err, products);
				});
		}
	], function(err, results) {
		let totalProducts = results[0];
		let products = results[1];

		res.json({
			success: true,
			message: 'category',
			products: products,
			totalProducts: totalProducts,
			pages: Math.ceil(totalProducts / perPage)
		});
	});
});


router.route('/categories')
	.get((req, res, next) => {
		Category.find({}, (err, categories) => {
			res.json({
				success: true,
				message: 'successful',
				categories: categories
			})
		})
	})
	.post((req, res, next) => {
		let category = new Category();
		category.name = req.body.category;
		category.save();
		res.json({
			success: true,
			message: 'successful'
		});
	});


// [For Explanation Only] example: async.waterfall()
router.get('/waterfall', (req, res, next) => {
	
	function number1(callback) {
		const firstName = 'Lebron';
		callback(null, firstName);
	}

	function number2(firstName, callback) {
		const lastName = 'James';
		console.log(`${firstName} ${lastName}`);
	}

	async.waterfall([number1, number2]);	// terminal: Lebron James
});

// '/categories/:id': find all products belong to the specific category:
router.get('/categories/:id', (req, res, next) => {
	const perPage = 10;
	const page = req.query.page;
	async.parallel([
		// get the total amount of products that belongs to the category
		function(callback) {
			Product.count({ category: req.params.id }, (err, count) => {
				let totalProducts = count;
				callback(err, totalProducts);
			});
		},
		// find all products under the given category
		function(callback) {
			Product.find({ category: req.params.id })
				.skip(perPage * page)	// page index starts from 0, so if 3 pages in total, skip 10 * 2 = 20 
				.limit(perPage)	// limit to 10 products per query
				.populate('category')
				.populate('owner')
				.populate('reviews')
				.exec((err, products) => {
					if (err) { return next(err); }
					callback(err, products);
				});
		},
		// get category name
		// (avoid 0 product under given caregory in previous function, otherwise `products[0]` would be risky)
		function(callback) {
			Category.findOne({ _id: req.params.id }, (err, category) => {
				callback(err, category)
			});
		}
	], function(err, results) {
		let totalProducts = results[0];
		let products = results[1];
		let category = results[2];

		res.json({
			success: true,
			message: 'category',
			products: products,
			categoryName: category.name,
			totalProducts: totalProducts,
			pages: Math.ceil(totalProducts / perPage)
		});
	});
});

// get a single product
router.get('/product/:id', (req, res, next) => {
	Product.findById({ _id: req.params.id })
		.populate('category')
		.populate('owner')
		.deepPopulate('reviews.owner')
		.exec((err, product) => {
			if (err) {
				res.json({
					success: false,
					message: 'product not found'
				});
			} else {
				if (product) {
					res.json({
						success: true,
						product: product
					});
				}
			}
		});
});

router.post('/review', checkJWT, (req, res, next) => {
	async.waterfall([
		function(callback) {	// find a single product
			Product.findOne({ _id: req.body.productId }, (err, product) => {
				if (product) {
					callback(err, product);
				}
			});
		},
		function(product) {
			let review = new Review();	// create a new review object
			review.owner = req.decoded.user._id;

			if (req.body.title) { review.title = req.body.title; }
			if (req.body.description) { review.description = req.body.description; }
			review.rating = req.body.rating;

			product.reviews.push(review._id);
			product.save();
			review.save();
			res.json({
				success: true,
				message: 'review added successfully'
			});
		}
	]);
});

module.exports = router;