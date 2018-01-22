const admin = require('firebase-admin');

module.exports = function(req, res) {
  //Verify the user provided a phone
  if (!req.body.phone) {
    return res.status(422).send({error: 'Bad input'});
  }
  // format the phone number to remove dashes and parens
  const phone = String(req.body.phone).replace(/[^\d]/g, '');
  // create a new user account using that phone number
  admin
    .auth()
    .createUser({uid: phone})
    .then(user => res.send(user))
    .catch(err => res.status(422).send({err: err}));
  // respond to the user request saying the account was made
};
