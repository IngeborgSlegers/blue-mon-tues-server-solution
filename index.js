const express = require('express');
const app = express();
const user = require('./controllers/user-controller');
const animal = require('./controllers/animal-controller');
const sequelize = require('./db');
const bodyParser = require('body-parser');

sequelize.sync();

app.use(bodyParser.json());

app.use(require('./middleware/headers'));

app.use('/user', user);

app.use(require('./middleware/validate-session'));
app.use('/animal', animal);

app.listen(3000, function(){
  console.log('App is listening on port 3000');
})
