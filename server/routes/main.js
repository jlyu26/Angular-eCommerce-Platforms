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

// Not the best practice: What if we got 10,000 products?
// Shouldn't send all of them to front-end at once.
router.get('/categories/:id', (req, res, next) => {
	const perPage = 10;
	Product.find({ category: req.params.id })	// find all products belong to the specific category
		.populate('category')
		.exec((err, products) => {
			Product.count({ category: req.params.id }, (err, totalProducts) => {
				res.json({
					success: true,
					message: 'category',
					products: products,
					categoryName: products[0].category.name,
					totalProducts: totalProducts,
					pages: Math.ceil(totalProducts / perPage)
				});
			});
		});
});

// example: async.waterfall()
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

module.exports = router;