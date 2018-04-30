# Angular-eCommerce-Platforms

An eCommerce website based on Angular 5, Node.js, MongoDB, AWS S3 (storage) and Angolia (search engine).

## Notes:

If the URL is `/api/categories/:id`, to get the specific id, we have to make request `req.params.id`. Let's say `id = 'awesome'`, where we write `req.params.id` equals to `'awesome'`.

The other way to get value from URL is `req.query`. For example, if the URL is `/api/categories/name?anyVariable=anyValue`, in order to get `'anyValue'`, we need to make `req.query.anyVariable`. This is usually used in search of a product or so in search engine.

## Challenge: Pagination

Pagination: limiting the amount of documents that we're going to get from MongoDB.

Async [[npm](https://www.npmjs.com/package/async)][[Document](https://caolan.github.io/async/docs.html#)]: a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript.

```javascript
const async = require('async');	

function number1(callback) {
	var firstName = 'Lebron';
	callback(null, firstName);
}

function number2(firstName, callback) {
	var lastName = 'James';
	console.log(`${firstName} ${lastName}`);
}

async.waterfall([number1, number2]);	// terminal: Lebron James
```

Function `number2` is depending on function `number1`. Function `number1` will run first and then run a callback, once it runs the callback it will actually go to function `number2`, and pass the value `firstName` into it. Function `number2` can then use the variable from function `number1` because it was passed in the callback. Just keep in mind that function `number2` will never run if function `number1` never do the callback. It executes in order `number1` -> `number2`, something exactly like 'waterfall'.