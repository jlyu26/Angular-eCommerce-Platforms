const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');
const userRoutes = require('./routes/account');

const app = express();

mongoose.connect(config.database, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('connected to database');
	}
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use('/api/accounts', userRoutes);

app.listen(config.port, (err) => {
	console.log(`listening: ${config.port}`);
});