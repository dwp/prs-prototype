const express = require('express')
const moment = require('moment')
const router = express.Router()

/**
 * Prototype index
 */
router.all('/', (req, res) => {
  req.session.data = {}
  res.render(`${__dirname}/views/index`, { isStart: true })
})

/**
 * Redirects to first question
 */
router.all('/questions', (req, res) => {
  return res.redirect('./questions/type-of-payment')
})

/**
 * What is the reason for this request?
 */
router.all('/questions/type-of-payment', (req, res) => {
  const submitted = req.body

  if (submitted.typeOfPayment) {
    return res.redirect('./two-months-arrears')
  }

  res.render(`${__dirname}/views/questions/type-of-payment`)
})

/**
 * Has your tenant missed 2 months or more of rent?
 */
router.all('/questions/two-months-arrears', (req, res) => {
  const submitted = req.body

  if (submitted.twoMonthsArrears === 'yes') {
    return res.redirect('./check-arrears')
  }

  if (submitted.twoMonthsArrears === 'no') {
    return res.redirect('./reason-for-request')
  }

  res.render(`${__dirname}/views/questions/two-months-arrears`)
})

/**
 * Reason for request
 */
router.all('/questions/reason-for-request', (req, res) => {
  const submitted = req.body

  if (submitted.reason) {
    return res.redirect('./check-arrears')
  }

  res.render(`${__dirname}/views/questions/reason-for-request`, {
    isEditMode: 'change' in req.query
  })
})

/**
 * Check arrears before redirect
 */
router.all('/questions/check-arrears', (req, res) => {
  const saved = req.session.data

  // Applying for "Direct rent payment"
  if (saved.typeOfPayment === 'Direct rent payment') {

    // Direct payment applications can have arrears
    if (saved.twoMonthsArrears === 'yes') {
      return res.redirect('./rent-arrears')
    }

    // Otherwise continue to rent details
    return res.redirect('./rent-details')
  }

  // Applying for either rent arrears option
  if (['Rent arrears', 'Both direct rent payment and rent arrears'].includes(saved.typeOfPayment)) {
    return res.redirect('./rent-arrears')
  }

  // Continue to two months arrears
  return res.redirect('./two-months-arrears')
})

/**
 * Rent arrears
 */
router.all('/questions/rent-arrears', (req, res) => {
  const saved = req.session.data

  // Format date fields
  saved.rentFirstMissingDate = formatDate(saved.rentFirstMissingDate)
  saved.rentLastMissingDate = formatDate(saved.rentLastMissingDate)

  // Format currency
  saved.rentOutstandingFormatted = currencyFromInput(saved.rentOutstanding)

  if (req.method === 'POST') {
    return res.redirect('change' in req.query ? './check-answers' : './rent-details')
  }

  res.render(`${__dirname}/views/questions/rent-arrears`, {
    isEditMode: 'change' in req.query
  })
})

/**
 * Rent details
 */
router.all('/questions/rent-details', (req, res) => {
  const saved = req.session.data

  // Format currency
  saved.rentAmountFormatted = currencyFromInput(saved.rentAmount)

  if (req.method === 'POST') {
    return res.redirect('change' in req.query ? './check-answers' : './tenant-details')
  }

  res.render(`${__dirname}/views/questions/rent-details`, {
    isEditMode: 'change' in req.query
  })
})

/**
 * Tenant details
 */
router.all('/questions/tenant-details', (req, res) => {
  const saved = req.session.data

  // Format date fields
  saved.tenantBirthDate = formatDate(saved.tenantBirthDate)

  if (req.method === 'POST') {
    return res.redirect('change' in req.query ? './check-answers' : './landlord-details')
  }

  res.render(`${__dirname}/views/questions/tenant-details`, {
    isEditMode: 'change' in req.query
  })
})

/**
 * Landlord details
 */
router.all('/questions/landlord-details', (req, res) => {
  if (req.method === 'POST') {
    return res.redirect('change' in req.query ? './check-answers' : './landlord-bank-details')
  }

  res.render(`${__dirname}/views/questions/landlord-details`, {
    isEditMode: 'change' in req.query
  })
})

/**
 * Landlord bank details
 */
router.all('/questions/landlord-bank-details', (req, res) => {
  if (req.method === 'POST') {
    return res.redirect('./check-answers')
  }

  res.render(`${__dirname}/views/questions/landlord-bank-details`, {
    isEditMode: 'change' in req.query
  })
})

/**
 * Check answers
 */
 router.all('/questions/check-answers', (req, res) => {
  let submission = {}

   if (req.method === 'POST') {
     submission.failed = true
   }

   res.render(`${__dirname}/views/questions/check-answers`, {
     isEditMode: 'change' in req.query,
     submission
   })
 })


/**
 * Feedback-satisfied
 */
 router.all('/questions/feedback-satisfied', (req, res) => {
   if (req.method === 'POST') {
     return res.redirect('../questions/feedback-easy')
   }

   res.render(`${__dirname}/views/questions/feedback-satisfied`, {
     isEditMode: 'change' in req.query
   })
 })

 /**
  * Feedback-easy
  */
  router.all('/questions/feedback-easy', (req, res) => {
    if (req.method === 'POST') {
      return res.redirect('../questions/feedback-time')
    }

    res.render(`${__dirname}/views/questions/feedback-easy`, {
      isEditMode: 'change' in req.query
    })
  })

  /**
   * Feedback-time
   */
   router.all('/questions/feedback-time', (req, res) => {
     if (req.method === 'POST') {
       return res.redirect('../questions/feedback-help')
     }

     res.render(`${__dirname}/views/questions/feedback-time`, {
       isEditMode: 'change' in req.query
     })
   })

   /**
    * Feedback-help
    */
    router.all('/questions/feedback-help', (req, res) => {
      if (req.method === 'POST') {
        return res.redirect('../questions/feedback-improve')
      }

      res.render(`${__dirname}/views/questions/feedback-help`, {
        isEditMode: 'change' in req.query
      })
    })

    /**
     * Feedback-improve
     */
     router.all('/questions/feedback-improve', (req, res) => {
       if (req.method === 'POST') {
         return res.redirect('../outcome/feedback-complete')
       }

       res.render(`${__dirname}/views/questions/feedback-improve`, {
         isEditMode: 'change' in req.query
       })
     })

     /**
      * Sorry we can't submit
      */
      router.all('/questions/not-submitted', (req, res) => {
        if (req.method === 'POST') {
          return res.redirect('../questions/check-answers')
        }

        res.render(`${__dirname}/views/questions/not-submitted`, {
          isEditMode: 'change' in req.query
        })
      })


/**
 * Pages catch all
 */
router.all('/pages/:page', (req, res) => {
  res.render(`${__dirname}/views/pages/${req.params.page}`, {
    isEditMode: 'change' in req.query
  })
})

/**
 * Questions catch all
 */
router.all('/questions/:question', (req, res) => {
  res.render(`${__dirname}/views/questions/${req.params.question}`, {
    isEditMode: 'change' in req.query
  })
})

/**
 * Outcome catch all
 */
router.all('/outcome/:outcome', (req, res) => {
  res.render(`${__dirname}/views/outcomes/${req.params.outcome}`)
})



/**
 * Format date for display
 */
function formatDate ({ day, month, year } = {}) {
  day = day ? day.padStart(2, '0') : ''
  month = month ? month.padStart(2, '0') : ''
  year = year || ''

  // Apply formatting
  const date = moment.utc(`${year}-${month}-${day}`, 'YYYY-MM-DD', true)
  const formatted = date.isValid() ? date.format('D MMMM YYYY') : ''

  return {
    day,
    month,
    year,
    date,
    formatted
  }
}

/**
 * Convert input to currency
 */
function currencyFromInput (input) {
  const number = numberFromInput(input)

  // Decimal places
  let minimumFractionDigits = 2
  let maximumFractionDigits = 2

  // Ignore non-numerics
  if (!(isNaN(parseFloat(number)) || !isFinite(number))) {
    // Decimal places are optional for '.00'
    if (number === parseInt(number, 10)) {
      minimumFractionDigits = 0
      maximumFractionDigits = 0
    }

    // Format as currency string
    input = number.toLocaleString('en-GB', {
      minimumFractionDigits,
      maximumFractionDigits
    })
  }

  return input
}

/**
 * Convert input to number
 */
function numberFromInput (input) {
  if (typeof input === 'string') {
    input = input.replace(/.(-)/g, '')

    // Only allow certain characters
    input = input.replace(/[^0-9.-]+/g, '')

    // Only allow the last period
    input = input.replace(/[.](?=.*[.])/g, '')
  }

  return parseFloat(input)
}

module.exports = router
