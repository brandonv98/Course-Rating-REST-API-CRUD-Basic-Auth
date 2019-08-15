'use strict';

const express = require('express');
const router = express.Router();
const Reviews = require('../models/models').Reviews;
const Users = require('../models/user').Users;
const Courses = require('../models/course').Courses;
// const mid = require('../middleware/mid').loggedOut;
const mid = require('../middleware/mid');

const {check, validationResult} = require('express-validator/check');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// Route that returns the current authenticated user.
router.get('/users', mid.authenticateUser, (req, res, next) => {
  const user = req.currentUser;
  
  // res.json({name: user.fullName, username: user.emailAddress, password: user.password});
});

// Route that creates a new user.
router.post('/users', [
  check('fullName')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "fullName"'),
  check('emailAddress')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "emailAddress"'),
  check('password')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "password"')
], (req, res, next) => {
  if(req.session) {
    //Delete session object
    req.session.destroy((err) => {
      if(err) {
        return next(err);
      }
       else {
        return console.log('Session destroyed : true.');
      }
    });
  }

  // Password match check.
  if (req.body.password !== req.body.confirmPassword) {
    const err = new Error('Passwords do not match.');
    err.status = 400;
    return next(err);
  }

  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors
      .array()
      .map(error => error.msg);
    // Return the validation errors to the client.
    return res
      .status(400)
      .json({errors: errorMessages});
  }

  // Get the user from the request body.
  const user = new Users(req.body);

  // Hash the new user's password.
  user.password = bcryptjs.hashSync(user.password);

  // Save new user to database.
  Users.create(user, (err, user) => {
  // Set the status to 201 Created and end the response.  
    if (err) {
      return next(err);
    } else {
      req.session.userId = user._id;
      return res.status(201);
    }
  });
});

//  Course routes.
router.get('/courses', (req, res, next) => {
  Courses
    .find({})
    .sort({createdAt: -1})
    .exec(function (err, courses) {
      if (err) 
        return next(err);
      res.json(courses);
    });
});

// Get specific course.
router.get('/courses/:courseId', (req, res, next) => {
  Courses.findOne({_id: req.params.courseId})
  // .sort({createdAt: -1})
    .exec(function (err, courses) {
      // if(err) return next(err);
      res.json(courses);
    });
});

//Update course.
router.put('/courses/:coursesId', (req, res, next) => {
  // Create new course Add data to DB. Return no data && set params to '/'.
  Courses
    .findById({_id: req.params.coursesId})
    .exec((err, course) => {
      if(err) return next(err);
      if (!course) {
        const error = new Error('Can not find course ID, please search a valid ID.');
        error.status = 404;
        return next(error);
      } 

      res.json(course);
    });
});

// Create reviews for specific course.
router.post('/courses/:courseId/reviews', (req, res, next) => {
  // Create new course Add data to DB. Return no data && set params to '/'.
});

// Create new course.
router.post('/courses', [
  check('title')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "description"'),
  check('steps')
    .exists({checkNull: true, checkFalsy: true})
    .withMessage('Please provide a value for "steps"'),
], (req, res, next) => {
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);
  
  // Check for authorization.
  if(!req.session.userId) {
    const err = new Error('You are unauthorized to view this page.');
    err.status = 403;
    return next(err);
  }
  Users
    .findById(req.session.userId)
    .exec( (error, user) => {
      // res.json(user, req.session.userId);
      console.log(user, 'posted to db', req.session.userId);
    });

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors
      .array()
      .map(error => error.msg);

    // Return the validation errors to the client.
    return res
      .status(400)
      .json({errors: errorMessages});
  }

  // Save new course data
  const course = new Courses(req.body);
  console.log(course);
  // course.save((err, course) => {
    // if (err) 
      // return next(err);
    res.status(201);
    res.json(course);
  // });
});



            module.exports = router;