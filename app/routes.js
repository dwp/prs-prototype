var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Route index page
router.post('/postcode/redirect', function (req, res) {
  res.render('./postcode_v3_1/full-service-email', {
    postcode: (req.body.postcode ? req.body.postcode : 'not entered')
  })
})

// Branching
router.get('/postcode_v3_1/full-service-email', function (req, res) {
  // get the answer from the query string (eg. ?over18=false)
  var gsi = req.query.gsi

  if (gsi === 'false') {
    // redirect to the relevant page
    res.redirect('/postcode_v3_1/request-form')
  } else {
    // if over18 is any other value (or is missing) render the page requested
    res.redirect('/postcode_v3_1/request-form-secure')
  }
})
// add your routes here

module.exports = router
