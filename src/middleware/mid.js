const auth = require('basic-auth');
const User = require('../models/user');

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