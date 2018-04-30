const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('O503XH661M', '4df35f4ba2f2ab7a2982d9366594a04b');
const index = client.initIndex('nenu-ecommerce');

router.get('/', (req, res, next) => {
	if (req.query.query) {
		index.search({
			query: req.query.query,
			page: req.query.page
		}, (err, content) => {
			res.json({
				success: true,
				message: 'here is the search result',
				status: 200,
				content: content,
				search_result: req.query.query
			});
		});
	}
});

module.exports = router;