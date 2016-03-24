// load the express package and create our app
var express = require('express');
var app     = express();

// set the port based on environment (more on environments later)
var port    = 1338; 

// send our index.html file to the user for the home page
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// start the server
app.listen(port);
console.log(port + ' is the magic port!');