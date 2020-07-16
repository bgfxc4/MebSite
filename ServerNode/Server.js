var express = require('express');
var app = express();

const users = [];

app.get('/users', (req, res) =>{
  res.json(users);
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});