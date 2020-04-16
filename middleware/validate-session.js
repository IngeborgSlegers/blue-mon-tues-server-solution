const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');

const validateSession = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('token -->', token);

  jwt.verify(token, 'Super secret', (err, decodedToken) => {
    console.log('decodedToken -->', decodedToken);
    if (!err && decodedToken) {
      User.findOne({ where: { id: decodedToken.id } })
        .then(user => {
          if (!user) throw 'err';

          console.log('user -->', user)
          req.user = user;
          return next();
        })
        .catch(err => res.status(501).json({ error: err }))
    } else {
      return res.status(500).json({ error: 'Unauthorized'})
    }
  });
}

module.exports = validateSession;