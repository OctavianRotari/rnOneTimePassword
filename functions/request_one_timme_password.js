// @flow
// admin is the service module
const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function(req, res) {
  if (!req.body.phone) {
    return res.status(422).send({error: 'Must provide a phone number'});
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  admin
    .auth()
    .getUser(phone)
    .then(userRecord => {
      const code = Math.floor(Math.random() * 899 + 1000);
      twilio.messages.create(
        {
          body: 'Your code is ' + code,
          to: phone,
          from: '+441882580432',
        },
        err => {
          if (err) {
            return res.status(422).send({error: err});
          }
          admin
            .database()
            .ref('users/' + phone)
            .update({code: code, codeValid: true}, () => {
              return res.status(200).send({success: true});
            });
        }
      )
    })
    .catch(err => {
      res.status(422).send({error: err});
    });
};
