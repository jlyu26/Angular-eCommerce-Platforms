// This file holds all product and category related routes

const router = require('express').Router();
const async = require('async');	// product loading pagination
const Category = require('../models/category');
const Product = require('../models/product');

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
				callback(err, totalProducts);	// trigger the next function
			});
		},
		// find all products under the given category
		function(callback) {
			Product.find({ category: req.params.id })
				.skip(perPage * page)	// page index starts from 0, so if 3 pages in total, skip 10 * 2 = 20 
				.limit(perPage)	// limit to 10 products per query
				.populate('category')
				.populate('owner')
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

module.exports = router;