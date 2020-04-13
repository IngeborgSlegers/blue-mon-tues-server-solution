var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

router.post('/create', (req, res) => {
  User.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 13)
  })
    .then(user => {
      let token = jwt.sign({ id: user.id }, 'Super secret', { expiresIn: '1d'});
      res.status(200).json({
        userResponse: user,
        tokenResponse: token
      })
    })
    .catch(err => res.status(500).json({ error: err }))
});

router.post('/login', (req, res) => {
  User.findOne({
    where: { username: req.body.username }
  })
    .then(user => {
      if(user) {
        bcrypt.compare(req.body.password, user.password, function(err, matches) {
          if(matches){
            let token = jwt.sign({ id: user.id }, 'Super secret', { expiresIn: '1d'});
            res.status(200).json({
              userResponse: user,
              tokenResponse: token
            });
          } else {
            res.status(401).json({ error: 'Username or password did not match.'})
          }
        })
      } else {
        res.status(401).json({ error: 'No user found'})
      }
    })
    .catch(err => res.status(500).json({ error: err }))
});

module.exports = router;