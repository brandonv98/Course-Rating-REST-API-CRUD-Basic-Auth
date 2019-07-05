const express = require('express');
const router = express.Router();


// send a friendly greeting for the root route
router.get('/', (req, res) => {
   res.json({
     message: 'Welcome to the Course Review API'
   });
 });

 
// router.get('/', function (req, res, next) {
//   return res.render('index', {message: 'Welcome to the Course Review API'});
// });



module.exports = router;