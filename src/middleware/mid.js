const auth = require('basic-auth');
// const bcryptjs = require('bcryptjs');
const User = require('../models/user');
// const Courses = require('../models/course');
// const {check, validationResult} = require('express-validator/check');

// Delete session object
const clearSessionToken = (req, res, next) => {
  if (req.session) {
    req
      .session
      .destroy((err) => {
        return (err
          ? next(err)
          : console.log('Session destroyed : true.'));
      });
  }
}

// Check if user is authenticated with session token.
const isUserAuth = (req, res, next) => {
  // Check for authorization.
  if (!req.session.userId) {
    const err = new Error('You are unauthorized to view this page.');
    err.status = 403;
    return next(err);
  } else {
    return next();
  }
}

const findUser = (req, res, next) => {
  console.log(req.params.courseId);
  Courses
    .findOne({_id: req.params.courseId})
    .exec((err, course) => {
      User
      .findOne({_id: course.user})
      .exec((error, user) => {
        console.log(user);
        return next();
      });
      return next();
    });
}


// Authenticate user on login.
const authenticateUser = (req, res, next) => {
  const credentials = auth(req);

  if (credentials) {
    User.authenticate(credentials.name, credentials.pass, (err, user) => {
      if (err) {
        return next(err);
      } else if (!user) {
        const err = new Error("No user found with that Auth.");
        err.status = 401;
        return next(err);
      } else if (user) {
        req.currentUser = user;
        // req.session.userId = user._id;
        console.log(req.session.userId);
        return next();
      }
    });
  } else {
    const err = new Error("Auth header not found");
    err.status = 401;
    return next(err);
  }
};

//  ---------- EXPORT MODULES ----------  //
module.exports.authenticateUser = authenticateUser;
module.exports.findUser = findUser;
module.exports.isUserAuth = isUserAuth;
module.exports.clearSessionToken = clearSessionToken;