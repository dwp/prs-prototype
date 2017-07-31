var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Route index page
router.post('/postcode/redirect', function (req, res) {
  res.render('./postcode/request-form', {
    postcode: (req.body.postcode ? req.body.postcode : 'not entered')
  })
})

// add your routes here

module.exports = router
