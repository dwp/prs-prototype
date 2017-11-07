module.exports = function(messagesToSend) {

  console.log('I have been called with:');
  console.dir(messagesToSend);
  // Expected input values: an array or objects where each object is an individual message to send
  // Each message object to be made up of:
  //    template: the template to use
  //    type of communication: 'sms' or 'email'
  //    whereTo: phone number or email address
  //    personalisaion: an object with keys to match the message to be sent

  const apiKey = process.env.API_KEY;
  var NotifyClient = require('notifications-node-client').NotifyClient;
  var notifyClient = new NotifyClient(apiKey);


  messagesToSend.forEach(function(element) {
    personalisation = {
      'refno': element.refno
    };
    // move through whatever we have and send the messages
    if (element.type === 'sms') {
      sendSms(element.template, element.to, element.personalisation)
    } else if (element.type === 'email') {
      sendEmail(element.template, element.to, element.personalisation)
    } else {
      console.log(`No message sent as could not detemine message type of: ${element.type}`)
    }
  });


  function sendEmail(emailTemplate, to, personalisation) {
    // Send Email
    notifyClient
      .sendEmail(emailTemplate, to, personalisation)
      .then(response => console.log(response))
      // .catch(err => res.send(err));
  };

  function sendSms(template, to, personalisation) {
    // Send SMS
      notifyClient
    	.sendSms(template, to, personalisation)
    	.then(response => console.log(response))
    	// .catch(err => res.send(err))
    ;
  };
};
