var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Route index page v1
router.post('/postcode/redirect', function (req, res) {
  res.render('./postcode/request-form', {
    postcode: (req.body.postcode ? req.body.postcode : 'not entered')
  })
})

// Route index page v3
router.post('/postcode_v3/redirect', function (req, res) {
  res.render('./postcode_v3/request-form', {
    postcode: (req.body.postcode ? req.body.postcode : 'not entered')
  })
})

// Route index page v3.1
router.post('/postcode_v3_1/redirect', function (req, res) {
  res.render('./postcode_v3_1/email-type', {
    postcode: (req.body.postcode ? req.body.postcode : 'not entered')
  })
})


// Branching v3.1
router.get('/postcode_v3_1/email-type', function (req, res) {
  res.render('./postcode_v3_1/request-form')
})

// add your routes here



module.exports = router
