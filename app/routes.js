var express = require('express')
var router = express.Router()


// this middleware function adds the username and password for the page to the nunjucks variables
// this is needed for the fetching of clientside resources ( eg, api calls - for the postcode lookup )
router.use((req, res, next) => {
    res.locals['auth'] = {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    }
    next()
})

// Route index page
router.get('/', function(req, res) {
    res.render('index')
})

// Route index page v1
router.post('/postcode/redirect', function(req, res) {
    res.render('./postcode/request -form', {
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
    // console.log(req.body.email)
    if (req.body.email === 'emailyes') {
        res.redirect('/postcode_v5/email-type')
    } else {
        res.redirect('/postcode_v5/post')
    }
})

router.post('/postcode_v6/email', function(req, res) {
    // console.log(req.body.email)
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
        // console.log('sms triggered');
        messagesToSend.push({
            type: 'sms',
            template: '6a1aebbc-78f7-49c2-9313-ddccb9164bce',
            to: req.session.landlordPhone,
            personalisation
        });
    }
    if (req.session.contactType.includes('email')) {
        // console.log('email triggered');
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
    // console.dir(req)
    var joint = req.query.joint
    // console.log(joint)

    if (joint === 'false') { // redirect to the relevant page
        res.redirect('onlineform/rent-details')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform/joint-tenancy-partner')
    }
})



// <<< creditor reference >>>

// router.get('/onlineform_v2/tenant-details', function(req, res) {
//     // get the answer from the query string (eg. ?over18=false)
//     // req.session.jointtenancy = req.query.jointtenancy
//     console.dir(req)
//     var arrears = req.query.arrears
//     console.log(arrears)

//     if (arrears === 'false') { // redirect to the relevant page
//         res.redirect('/onlineform_v2/request-reason')
//     } else {
//         // if over18 is any other value (or is missing) render the page requested
//         res.render('onlineform_v2/tenant-details')
//     }
// })



router.get('/onlineform/partner-name', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    // req.session.jointtenancy = req.query.jointtenancy
    // console.dir(req)
    var partner = req.query.partner
    // console.log(partner)

    if (partner === 'false') { // redirect to the relevant page
        res.redirect('/onlineform/rent-details')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform/partner-name')
    }
})

router.get('/onlineform/service-charge-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    // req.session.jointtenancy = req.query.jointtenancy
    // console.dir(req)
    var servicecharge = req.query.servicecharge
    // console.log(servicecharge)

    if (servicecharge === 'false') { // redirect to the relevant page
        res.redirect('/onlineform/check-your-answers')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform/service-charge-details')
    }
})


router.get('/onlineform/rent-statement-upload', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    // req.session.jointtenancy = req.query.jointtenancy
    // console.dir(req)
    var rentstatement = req.query.rentstatement
    // console.log(rentstatement)

    if (rentstatement === 'false') { // redirect to the relevant page
        res.redirect('/onlineform/rent-arrears-details')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform/rent-statement-upload')
    }
})

/////// Online form v2 ///////

router.get('/onlineform_v2/landlord-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    // req.session.jointtenancy = req.query.jointtenancy
    // console.dir(req)
    var arrears = req.query.arrears
    // console.log(arrears)

    if (arrears === 'false') { // redirect to the relevant page
        res.redirect('/onlineform_v2/request-reason')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v2/landlord-details')
    }
})


router.get('/onlineform_v2/joint-tenancy-partner', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    // req.session.jointtenancy = req.query.jointtenancy
    // console.dir(req)
    var joint = req.query.joint
    // console.log(joint)

    if (joint === 'false') { // redirect to the relevant page
        res.redirect('/onlineform_v2/rent-details')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v2/joint-tenancy-partner')
    }
})

router.get('/onlineform_v2/partner-name', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    // req.session.jointtenancy = req.query.jointtenancy
    // console.dir(req)
    var partner = req.query.partner
    // console.log(partner)

    if (partner === 'false') { // redirect to the relevant page
        res.redirect('/onlineform_v2/rent-details')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v2/partner-name')
    }
})

router.get('/onlineform_v2/service-charge-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    // req.session.jointtenancy = req.query.jointtenancy
    // console.dir(req)
    var servicecharge = req.query.servicecharge
    // console.log(servicecharge)

    if (servicecharge === 'false') { // redirect to the relevant page
        res.redirect('/onlineform_v2/check-your-answers')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v2/service-charge-details')
    }
})

router.get('/onlineform_v2/rent-statement-upload', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    // req.session.jointtenancy = req.query.jointtenancy
    // console.dir(req)
    var rentstatement = req.query.rentstatement
    // console.log(rentstatement)

    if (rentstatement === 'false') { // redirect to the relevant page
        res.redirect('/onlineform_v2/rent-arrears-details')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v2/rent-statement-upload')
    }
})

router.use('/postcode', require('./postcodes'))


/////// Online form v3 ///////



router.get('/onlineform_v3/rent-arrears-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    // req.session.jointtenancy = req.query.jointtenancy
    // console.dir(req)
    var arrears = req.query.arrears
    // console.log(arrears)

    if (arrears === 'false') { // redirect to the relevant page
        res.redirect('/onlineform_v3/request-reason')
    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v3/rent-arrears-details')
    }
})

router.post('/onlineform_v3/actual_arrears', (req, res) => {
    const answers = req.session.data
    if (answers['request-types'] && answers.arrears) {

        const isDirectRentPaymentOnly = answers['request-types'].length === 1 && answers['request-types'][0] === 'Direct rent payment'
        const isArrears = answers.arrears === 'true'

        const skip = isDirectRentPaymentOnly && isArrears
        res.redirect(skip ?
            '/onlineform_v3/rent-details' :
            '/onlineform_v3/rent-arrears-details'
        )
    } else {
        res.redirect('/onlineform_v3/rent-arrears-details')
    }
})


router.use('/postcode', require('./postcodes'))

/////// Online form v4 ///////


router.get('/onlineform_v4/arrears', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var requestType = req.query.requestType

    if (requestType === 'Direct rent payment') {
        // redirect to the relevant page
        res.redirect('/onlineform_v4/dr-arrears')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v4/arrears')
    }
})


router.get('/onlineform_v4/dr-rent-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var drarrears = req.query.drarrears

    if (drarrears === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v4/dr-request-reason')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v4/dr-rent-details')
    }
})

router.get('/onlineform_v4/rent-arrears-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var arrears = req.query.arrears

    if (arrears === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v4/request-reason')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v4/rent-arrears-details')
    }
})


//  postal route

router.post('/onlineform_v4/redirect', function(req, res) {
    var fullservicepostcodes = [
        'a', 'b', 'c'
    ]
    var firstCharacterInPostcode = req.body.postcode.charAt(0)
    firstCharacterInPostcode = firstCharacterInPostcode.toLowerCase()
    console.log('firstcharacter is ' + firstCharacterInPostcode)


    if (fullservicepostcodes.includes(firstCharacterInPostcode)) {
        console.log('this isa full service postcode!')
        res.redirect('/onlineform_v4/full-post')
    } else {
        console.log('this is not a fullservice postcode')
        res.redirect('/onlineform_v4/live-post')
    }
    // res.render('./onlineform_v4/email', {
    //     postcode: (req.body.postcode ? req.body.postcode : 'not entered')
    // })
})


/////// Online form v5 ///////


router.get('/onlineform_v5/arrears', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var requestType = req.query.requestType

    if (requestType === 'Direct rent payment') {
        // redirect to the relevant page
        res.redirect('/onlineform_v5/dr-arrears')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v5/arrears')
    }
})


router.get('/onlineform_v5/dr-rent-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var drarrears = req.query.drarrears

    if (drarrears === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v5/dr-request-reason')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v5/dr-rent-details')
    }
})




router.get('/onlineform_v5/rent-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    console.log('yes')
    var arrears = req.query.arrears

    if (arrears === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v5/request-reason')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v5/rent-details')
    }
})




// router.get('/onlineform_v5/rent-arrears-details', function(req, res) {
//     // get the answer from the query string (eg. ?over18=false)
//     var arrears = req.query.arrears

//     if (arrears === 'false') {
//         // redirect to the relevant page
//         res.redirect('/onlineform_v5/request-reason')

//     } else {
//         // if over18 is any other value (or is missing) render the page requested
//         res.render('onlineform_v5/rent-details')
//     }
// })

router.route('/onlineform_v5/tenant-details').get(function(req, res) {

    res.render('onlineform_v5/tenant-details')

}).post(function(req, res) {


    var requestType = req.session.data.requestType
    console.dir(req.session)
    console.log('requestType is ' + requestType)
    if (requestType === 'Direct rent payment') {
        console.log('drarrears')
        res.redirect('/onlineform_v5/dr-arrears')

    } else {
        console.log('arrears')
        res.redirect('/onlineform_v5/arrears')
    }
})

router.get('/onlineform_v5/dr-service-charge-type', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var drservice = req.query.drservice

    if (drservice === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v5/dr-landlord-bank')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v5/dr-service-charge-type')
    }
})

router.get('/onlineform_v5/dr-check-your-answers', (req, res) => {
    console.dir(req.session.data)
    res.render('onlineform_v5/dr-check-your-answers')
})

router.get('/onlineform_v5/service-charge-type', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var service = req.query.service

    if (service === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v5/landlord-bank')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v5/service-charge-type')
    }
})



/////// Online form v6 social ///////


router.get('/onlineform_v6_social/arrears', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var requestType = req.query.requestType

    if (requestType === 'Direct rent payment') {
        // redirect to the relevant page
        res.redirect('/onlineform_v6_social/dr-arrears')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v6_social/arrears')
    }
})


router.get('/onlineform_v6_social/dr-rent-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var drarrears = req.query.drarrears

    if (drarrears === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v6_social/dr-request-reason')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v6_social/dr-rent-details')
    }
})




router.get('/onlineform_v6_social/rent-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    console.log('yes')
    var arrears = req.query.arrears

    if (arrears === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v6_social/request-reason')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v6_social/rent-details')
    }
})




// router.get('/onlineform_v5/rent-arrears-details', function(req, res) {
//     // get the answer from the query string (eg. ?over18=false)
//     var arrears = req.query.arrears

//     if (arrears === 'false') {
//         // redirect to the relevant page
//         res.redirect('/onlineform_v5/request-reason')

//     } else {
//         // if over18 is any other value (or is missing) render the page requested
//         res.render('onlineform_v5/rent-details')
//     }
// })

router.route('/onlineform_v6_social/tenant-details').get(function(req, res) {

    res.render('onlineform_v6_social/tenant-details')

}).post(function(req, res) {


    var requestType = req.session.data.requestType
    console.dir(req.session)
    console.log('requestType is ' + requestType)
    if (requestType === 'Direct rent payment') {
        console.log('drarrears')
        res.redirect('/onlineform_v6_social/dr-arrears')

    } else {
        console.log('arrears')
        res.redirect('/onlineform_v6_social/arrears')
    }
})

router.get('/onlineform_v6_social/dr-service-charge-type', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var drservice = req.query.drservice

    if (drservice === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v6_social/dr-landlord-bank')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v6_social/dr-service-charge-type')
    }
})

router.get('/onlineform_v6_social/dr-check-your-answers', (req, res) => {
    console.dir(req.session.data)
    res.render('onlineform_v6_social/dr-check-your-answers')
})

router.get('/onlineform_v6_social/service-charge-type', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var service = req.query.service

    if (service === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v6_social/rent-arrears-details')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v6_social/service-charge-type')
    }
})


/////// Online form v6 private ///////


router.get('/onlineform_v6_private/arrears', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var requestType = req.query.requestType

    if (requestType === 'Direct rent payment') {
        // redirect to the relevant page
        res.redirect('/onlineform_v6_private/dr-arrears')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v6_private/arrears')
    }
})


router.get('/onlineform_v6_private/dr-rent-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var drarrears = req.query.drarrears

    if (drarrears === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v6_private/dr-request-reason')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v6_private/dr-rent-details')
    }
})




router.get('/onlineform_v6_private/rent-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    console.log('yes')
    var arrears = req.query.arrears

    if (arrears === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v6_private/request-reason')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v6_private/rent-details')
    }
})




// router.get('/onlineform_v5/rent-arrears-details', function(req, res) {
//     // get the answer from the query string (eg. ?over18=false)
//     var arrears = req.query.arrears

//     if (arrears === 'false') {
//         // redirect to the relevant page
//         res.redirect('/onlineform_v5/request-reason')

//     } else {
//         // if over18 is any other value (or is missing) render the page requested
//         res.render('onlineform_v5/rent-details')
//     }
// })

router.route('/onlineform_v6_private/tenant-details').get(function(req, res) {

    res.render('onlineform_v6_private/tenant-details')

}).post(function(req, res) {


    var requestType = req.session.data.requestType
    console.dir(req.session)
    console.log('requestType is ' + requestType)
    if (requestType === 'Direct rent payment') {
        console.log('drarrears')
        res.redirect('/onlineform_v6_private/dr-arrears')

    } else {
        console.log('arrears')
        res.redirect('/onlineform_v6_private/arrears')
    }
})

router.get('/onlineform_v6_private/dr-service-charge-type', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var drservice = req.query.drservice

    if (drservice === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v6_private/dr-landlord-bank')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v6_private/dr-service-charge-type')
    }
})

router.get('/onlineform_v6_private/dr-check-your-answers', (req, res) => {
    console.dir(req.session.data)
    res.render('onlineform_v6_private/dr-check-your-answers')
})

router.get('/onlineform_v6_private/service-charge-type', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var service = req.query.service

    if (service === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v6_private/rent-arrears-details')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v6_private/service-charge-type')
    }
})


////// Online form v7 ///////


router.get('/onlineform_v7/arrears', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var requestType = req.query.requestType

    if (requestType === 'Direct rent payment') {
        // redirect to the relevant page
        res.redirect('/onlineform_v7/dr-arrears')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v7/arrears')
    }
})


router.get('/onlineform_v7/dr-rent-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var drarrears = req.query.drarrears

    if (drarrears === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v7/dr-request-reason')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v7/dr-rent-details')
    }
})

router.get('/onlineform_v7/rent-arrears-details', function(req, res) {
    // get the answer from the query string (eg. ?over18=false)
    var arrears = req.query.arrears

    if (arrears === 'false') {
        // redirect to the relevant page
        res.redirect('/onlineform_v7/request-reason')

    } else {
        // if over18 is any other value (or is missing) render the page requested
        res.render('onlineform_v7/rent-arrears-details')
    }
})



module.exports = router