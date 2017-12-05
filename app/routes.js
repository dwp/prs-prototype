var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function(req, res) {
    res.render('index')
})

// Route index page v1
router.post('/postcode/redirect', function(req, res) {
    res.render('./postcode/request-form', {
        postcode: (req.body.postcode ? req.body.postcode : 'not entered')
    })
})

// Route index page v3
router.post('/postcode_v3/redirect', function(req, res) {
    res.render('./postcode_v3/request-form', {
        postcode: (req.body.postcode ? req.body.postcode : 'not entered')
    })
})

// Route index page v3.1
router.post('/postcode_v3_1/redirect', function(req, res) {
    res.render('./postcode_v3_1/email-type', {
        postcode: (req.body.postcode ? req.body.postcode : 'not entered')
    })
})

// Route index page v5
router.post('/postcode_v5/redirect', function(req, res) {
    res.render('./postcode_v5/email', {
        postcode: (req.body.postcode ? req.body.postcode : 'not entered')
    })
})

// Route index page v6
router.post('/postcode_v6/redirect', function(req, res) {
    res.render('./postcode_v6/email', {
        postcode: (req.body.postcode ? req.body.postcode : 'not entered')
    })
})


// Branching v3.1
router.get('/postcode_v3_1/email-type', function(req, res) {
    res.render('./postcode_v3_1/request-form')
})

// add your routes here

router.post('/postcode_v5/email', function(req, res) {
    console.log(req.body.email)
    if (req.body.email === 'emailyes') {
        res.redirect('/postcode_v5/email-type')
    } else {
        res.redirect('/postcode_v5/post')
    }
})

router.post('/postcode_v6/email', function(req, res) {
    console.log(req.body.email)
    if (req.body.email === 'emailyes') {
        res.redirect('/postcode_v6/email-type')
    } else {
        res.redirect('/postcode_v6/post')
    }
})


// Branching v5
router.post('/postcode_v5/email-type', function(req, res) {
    res.redirect('/postcode_v5/request-form')
})

// Branching v6
router.post('/postcode_v6/email-type', function(req, res) {
    res.redirect('/postcode_v6/request-form')
})


///////////////////////////////////////////////

router.post('/notify-automated/landlord-contact', function(req, res) {
    req.session.landlordPhone = req.body.landlordPhone;
    req.session.landlordEmail = req.body.landlordEmail;
    res.redirect('./landlord-bank')
})

router.get('/notify-automated/contact-confirm', function(req, res) {
    // console.log(`the current value of phone is: ${req.session.landlordPhone}`)
    // console.log(`the current value of email is: ${req.session.landlordEmail}`)
    res.render('./notify-automated/contact-confirm', { landlordPhone: req.session.landlordPhone })
})

router.post('/notify-automated/contact-confirm', function(req, res) {
    req.session.landlordPhone = req.body.landlordSmsContactNumber;
    res.render('./notify-automated/declaration')
})

router.post('/notify-automated/contact-method', function(req, res) {
    req.session.contactType = req.body.contactType;
    // console.log(`contact method is: ${req.session.contactType}. and the type is: ${typeof(req.session.contactType)}`)
    res.redirect('./contact-confirm')
})

router.get('/notify-automated/submitted', function(req, res) {
    // const reference = 'DWP0002017G6YDS';
    const messagesToSend = []
    const personalisation = { 'refno': 'AA123' }
    if (req.session.contactType.includes('sms')) {
        console.log('sms triggered');
        messagesToSend.push({
            type: 'sms',
            template: '6a1aebbc-78f7-49c2-9313-ddccb9164bce',
            to: req.session.landlordPhone,
            personalisation
        });
    }
    if (req.session.contactType.includes('email')) {
        console.log('email triggered');
        messagesToSend.push({
            type: 'email',
            template: '0f6f2be7-ec6b-4e59-bfa1-207f3aed03fc',
            to: req.session.landlordEmail,
            personalisation
        });
    }

    var callMe = require('./assets/javascripts/notify')(messagesToSend);
    res.render('./notify-automated/submitted', { reference: personalisation.refno, phone: req.session.landlordPhone, email: req.session.landlordEmail });
    // res.send(messagesToSend);
})
///////////////////////////////////////////////



// router.post('/onlineform/joint-tenancy', function(req, res) {
//     console.log(req.body.joint - tenancy)
//     if (req.body.jointtenancy === 'joint-tenancy-yes') {
//         res.redirect('/onlineform/joint-tenancy-partner')
//     } else {
//     res.redirect('/onlineform/rent-details')
//     }
// })

router.get('/onlineform/joint-tenancy-partner', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    // req.session.jointtenancy = req.query.jointtenancy
    console.dir(req)
    var joint = req.query.joint
    console.log(joint)

    if (joint === 'false') { // redirect to the relevant page
        res.redirect('/onlineform/rent-details')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform/joint-tenancy-partner')
    }
})


module.exports = router