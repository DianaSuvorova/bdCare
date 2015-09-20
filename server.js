var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');

app.use(express.static(__dirname + '/build'));

//virtual directory.
app.use('/group/', express.static(__dirname + '/build'));
app.use('/group/*/period/', express.static(__dirname + '/build'));

app.all('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening', host, port);
});
