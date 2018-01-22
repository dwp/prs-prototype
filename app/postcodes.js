const router = require('express').Router()

const addresses = [
  { address: [ '34 Carr Street', 'Ecclesall', 'Sheffield', 'S119PJ' ] },
  { address: [ 'Flat 26', 'Nightingale Road', 'Newton Heath', 'M100AE' ] }
]

router.route('/:postcode').get((req, res) => {
  res.json(addresses[req.params.postcode.toUpperCase() === 'S119PJ' ? 0 : 1])
})

module.exports = router
