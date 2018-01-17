module.exports = (addresses) => {
  const router = require('express').Router()
  const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const getLetterScore = letter => arr.indexOf(letter.toLowerCase()) % addresses.length

  router.route('/:postcode').get((req, res) => {
    res.json(addresses[getLetterScore(req.params.postcode.charAt(0))])
  })

  return router
}
