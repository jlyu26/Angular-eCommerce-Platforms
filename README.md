# Angular-eCommerce-Platforms

An eCommerce website based on Angular 5, Node.js, MongoDB and AWS S3.

## Notes:

If the URL is `/api/categories/:id`, to get the specific id, we have to make request `req.params.id`. Let's say `id = 'awesome'`, where we write `req.params.id` equals to `'awesome'`.

The other way to get value from URL is `req.query`. For example, if the URL is `/api/categories/name?anyVariable=anyValue`, in order to get `'anyValue'`, we need to make `req.query.anyVariable`. This is usually used in search of a product or so in search engine.