'use strict';

// load modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Create express app
const app = express();

const url = `mongodb://localhost:27017/course-api`;

mongoose.connect(`${url}`);
const db = mongoose.connection;

// Mongo error catch
db.on('error', console.error.bind(console, 'connection error:'));

// MandoDB connection
db.once("open", () => {
  console.log("db connection successful");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// API routes = /api.
const routes = require('./routes/index');
app.use('/api', routes);

// send 404 if no other route matched
app.use((req, res) => {
  res
    .status(404)
    .json({message: 'Route Not Found'})
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({message: err.message, error: {}});
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
