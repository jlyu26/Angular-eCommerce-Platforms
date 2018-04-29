// Define a customized function to check if a token exist or not on
// HTTP authorization header:

const jwt = require('jsonwebtoken');
const config= require('../config');

module.exports = function(req, res, next) {
	let token = req.headers['authorization'];

	// check if the http header contains any token or not
	if (token) {
		jwt.verify(token, config.secret, function(err, decoded) {
			if (err) {
				res.json({
					success: false,
					message: 'failed to authenticate token'
				});
			} else {
				req.decoded = decoded;
				next();
				// user information already encrypted in the token,
				// so later if we want access user object or property,
				// we can use `req.decoded.user.name`, etc.
			}
		});

	} else {
		res.status(403).json({
			success: false,
			message: 'no token provided'
		});
	}
}