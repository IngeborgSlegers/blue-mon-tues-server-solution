var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var Animal = sequelize.import('../models/animal');
// const validateSession = require('../middleware/validate-session');

router.post('/create', (req, res) => {
  console.log('req -->', req);
  const animalFromRequest = {
    name: req.body.name,
    legNumber: req.body.legNumber,
    predator: req.body.predator,
    userId: req.user.id
  }
  Animal.create(animalFromRequest)
    .then(animal => res.status(200).json(animal))
    .catch(err => res.json(req.errors))
})

router.get('/', function (req, res) {
  Animal.findAll()
    .then(animal => {
      res.status(200).json({
        animal: animal,
        message: 'Animal(s) successfully retrieved!',
        number: `${animal.length} number of animals`
      })
    })
    .catch(err => res.status(500).json({ error: err }))
})

router.delete('/delete/:id', (req, res) => {
  console.log('userId -->', req.user.id);
  Animal.destroy({ where: { id: req.params.id, userId: req.user.id } })
    .then(recordsChanged => res.status(200).json({ message: `${recordsChanged} record(s) deleted.` }))
    .catch(err => res.status(500).json({ error: err }))
})

router.put('/:id', (req, res) => {
  // Animal.update({
  //   name: req.body.name,
  //   legNumber: req.body.legNumber,
  //   predator: req.body.predator
  // }, {
  //   where: {
  //     id: req.params.id
  //   }
  // })
  //   .then(recordsChanged => res.status(200).json({ message: 'Animal updated'}))
  //   .catch(err => res.status(500).json({message: 'Update Failed', error: err}))
  
  Animal.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(recordsChanged => res.status(200).json({ message: 'Animal updated'}))
    .catch(err => res.status(500).json({message: 'Update Failed', error: err}))

})

module.exports = router;