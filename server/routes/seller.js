const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');	// a library for communicating with aws services
const multer = require('multer');	// a library to upload images
const multerS3 = require('multer-s3');	// a library to upload directly to S3
const s3 = new aws.S3({	// in order to communicate with S3 bucket
	accessKeyId: 'AKIAJYMMVNNOVH5POGZA', 
	secretAccessKey: 'GQzODIxukLuFOprw1YjGewq/YBOgAfGaHuiqdQgt' 
});

const faker = require('faker');	// generate 'products' for testing

const checkJWT = require('../middlewares/check-jwt');

var upload = multer({	// create a storage
	storage: multerS3({
		s3: s3,
		bucket: 'nenu-ecommerce',
		metadata: function(req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function(req, file, cb) {
			cb(null, Date.now().toString())
		}
	})
});

router.route('/products')
	.get(checkJWT, (req, res, next) => {
		Product.find({ owner: req.decoded.user._id })
			.populate('owner')	// populate: get owner and category objects, otherwise only return id property
			.populate('category')
			.exec((err, products) => {
				if (products) {
					res.json({
						success: true,
						message: 'Products',
						products: products
					});
				}
			});
	})
	.post([checkJWT, upload.single('product_picture')], (req, res, next) => {
		let product = new Product();
		product.owner = req.decoded.user._id;
		product.category = req.body.categoryId;
		product.title = req.body.title;
		product.price = req.body.price;
		product.description = req.body.description;
		product.image = req.file.location;
		product.save();
		res.json({
			success: true,
			message: 'successfully added the product'
		});
	});

// fake product data, for testing only
router.get('/faker/test', (req, res, next) => {
	for (let i = 0; i < 20; i++) {
		let product = new Product();
		product.category = '5ae556c42f1bc7117cebb20a';
		product.owner = '5ae4cbe1f23d073ee0fe55cb';
		product.image = faker.image.cats();
		product.title = faker.commerce.productName();
		product.description = faker.lorem.words();
		product.price = faker.commerce.price();
		product.save();
	}

	res.json({
		message: 'successfully added 20 products'
	});
});

module.exports = router;