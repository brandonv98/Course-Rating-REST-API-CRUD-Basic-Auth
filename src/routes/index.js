'use strict';

const express = require('express');
const router = express.Router();
const Review = require('../models/reviews');
const User = require('../models/user');
const Course = require('../models/course');
const mid = require('../middleware/mid');

const {check, validationResult} = require('express-validator/check');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

// ----------- USER ROUTES ---------- // Route that returns the current
// authenticated user.
router.get('/users', mid.authenticateUser, (req, res) => {
    // console.log(req.currentUser, req.session.userId);
    res.json({
      user: req.currentUser,
    });
    return res.end();
});

// // Route that creates a new user.
router.post('/users', (req, res, next) => {
  // Creates a user to model spec.
  const user = new User(req.body);
  // Save new user.
  user.save(err => {
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.status(201);
    res.set("Location", "/");
    return res.end();
  });
});

//   ---------- COURSE ROUTES. ----------   //
router.get('/courses', mid.isUserAuth, mid.authenticateUser, (req, res, next) => {
  Course
    .find({}
      // {title: true}
      )
    // .sort({createdAt: -1})
    .exec(function (err, courses) {
      if (err) 
        return next(err);
      res.status(200);
      res.json(courses);
    });
});

// Get specific course by ID.
router.get('/courses/:courseId', mid.authenticateUser, (req, res, next) => {
Course
    .findOne({_id: req.params.courseId})
    .populate({
      path: "user",
      select: "fullName",
      model: "User",
    })
    .populate("reviews")
    .exec((err, courses) => {
      if (err) 
        return next(err);

        console.log(courses);
      res.status(200);
      res.json(courses);
      return res.end();
    });
});

//  Update course.
router.put('/courses/:coursesId', mid.authenticateUser, (req, res, next) => {
  // Create new course Add data to DB. Return no data && set params to '/'.
  Course
    .findById({_id: req.params.coursesId})
  // Update the document.
    .update(req.body)
    .exec((err, course) => {
      if (err) 
        return next(err);
      if (!course) {
        const error = new Error(`Can't find course ID, please enter a valid ID.`);
        error.status = 404;
        return next(error);
      }
      // Get the users data to update
      const getBody = Course(req.body);
      // Check if user supplied correct data
      if (!getBody) {
        const error = new Error(`Please provide valid data.`);
        error.status = 401;
        return next(error);
      } else {
        res.status = 204;
        res.end();
      }
    });
});

// Create new course.
router.post('/courses', mid.authenticateUser, (req, res, next) => {

  // Get user entered course data
  const course = new Course(req.body);
  // Save new course data
  course.save(err => {
    // Set the status to 201 Created and end the response.
    if (err) 
      return next(err);
    res.status(201)
    .location('/');
    return res.end();
  });
});

//  ---------- REVIEWS ROUTE ---------- // Create reviews for specific course &&
// append to course.
router.post('/courses/:courseId/reviews', mid.authenticateUser, (req, res, next) => {
  // console.log(req.currentUser);
  // if ((req.currentUser._id).toString() === (req.course.user).toString()) {
  //   const err = new Error("You are not allowed to review your own course.");
  //   err.status = 403;
  //   return next(err);
  // }
  
  const review = new Review(req.body);
  
  review.save((err) => {
    if (err) {
      err.status = 400;
      return next(err);
    }

    Course
      .findById(req.params.courseId)
      .populate("reviews")
      .exec((err, course) => {
        if (err) 
          return next(err);
        // Add users review to the course.
        course.reviews.push(review);
        course.save(err => {
          if (err) 
            return next(err);
          res
            .location('/')
            .status(201)
            return res.end();
            // .json(course);
        });
      });
  });
});

module.exports = router;
