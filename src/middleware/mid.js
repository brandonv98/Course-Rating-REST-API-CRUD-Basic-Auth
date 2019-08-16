const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const Users = require('../models/user').Users;
const {check, validationResult} = require('express-validator/check');

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
};
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

// Authenticate user on login.
const authenticateUser = (req, res, next) => {
  let message = null;
  // let user; Get the user's credentials from the Authorization header.
  const credentials = auth(req);

  if (credentials) {
    // Find req user in DB.
    Users
      .findOne({emailAddress: credentials.name})
      .exec(function (error, user) {
        if (error) {
          return next(err);
        } else if (!user) {
          const error = new Error('User not found.');
          error.status = 401;
          return next(error);
        }
        // Verify user credentials are entered.
        if (user) {
          const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

          // console.log(authenticated);
          if (authenticated) {
            console.log(`Authentication successful for user: ${user.fullName}`);

            // Store the user on the Request object.
            req.currentUser = user;
            req.session.userId = user._id;
            res.json(user);
            // req.loggedUser = user.fullName;
          } else {
            message = `Authentication failure for username: ${user.emailAddress}`;
            res.json({message: "Authentication failure for username or password."});
          }
        } else {
          message = `User not found for username: ${credentials.emailAddress}`;
        }
      });

  } else {
    message = 'Auth header not found';
  }

  if (message) {
    console.warn(message);
    res
      .status(401)
      .json({message: 'Access Denied'});
  } else {
    return next();
  }
};

module.exports.authenticateUser = authenticateUser;