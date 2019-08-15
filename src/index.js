'use strict';

// load modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const assert = require('assert');
// Create express app
const app = express();
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const auth = require('basic-auth');
const url = `mongodb://localhost:27017/course-api`;

mongoose.connect(`${url}`);
const db = mongoose.connection;

// Mongo error catch
db.on('error', console.error.bind(console, 'connection error:'));

// use sessions for tracking logins
app.use(session({
  secret: 'course api secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: db})
}));

// Make user ID available in template.
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

// make user ID available in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

// MandoDB connection
db.once("open", () => {
  console.log("db connection successful");
  // db.close();
});

// app.use(jsonCheck);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(jsonCheck);
// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// TODO add additional routes here

const routes = require('./routes/index');
app.use('/api', routes);

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {   throw new Error('Test error'); });
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
