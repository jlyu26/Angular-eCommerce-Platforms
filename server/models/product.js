const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	category: { type: Schema.Types.Object, ref: 'Category' },
	owner: { type: Schema.Types.Object, ref: 'User' },
	image: String,
	title: String,
	description: String,
	price: Number,
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);