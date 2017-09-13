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

// Route index page v5
router.post('/postcode_v5/redirect', function (req, res) {
  res.render('./postcode_v5/email', {
    postcode: (req.body.postcode ? req.body.postcode : 'not entered')
  })
})


// Branching v3.1
router.get('/postcode_v3_1/email-type', function (req, res) {
  res.render('./postcode_v3_1/request-form')
})

// add your routes here

router.post('/postcode_v5/email', function(req, res) {
  console.log(req.body.email)
  if(req.body.email==='emailyes') {
    res.redirect('/postcode_v5/email-type')
  }
  else{
    res.redirect('/postcode_v5/post')}
})


// Branching v5
router.post('/postcode_v5/email-type', function (req, res) {
  res.redirect('/postcode_v5/request-form')
})

module.exports = router
