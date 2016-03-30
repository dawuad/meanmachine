// BASE SETUP
// ======================================

var restify = require('restify');
var morgan     = require('morgan'); 		// used to see requests
var mongoose   = require('mongoose');
var User       = require('./app/models/user');
var port       = process.env.PORT || 8080; // set the port for our app

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.use(morgan('dev'));
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

mongoose.connect('mongodb://localhost/users'); 

//Retrieve Users
function getUsers(req, res, next) {  
  User.find(function(err, users) {
		if (err) return res.send(err);		
		res.send(users);		
  });
  next();
}

//Retrieve User
function getUser(req, res, next){
	User.findById(req.params.user_id, function(err, user) {
		if (err) return res.send(err);
		res.send(user);
	});
	next();
}

//Update User
function updateUser(req, res, next){
	User.findById(req.params.user_id, function(err, user) {
		console.log("old name " + user.name + " new name" + req.body.name);
		if (err) return res.send(err);
		// set the new user information if it exists in the request
		if (req.body.name) user.name = req.body.name;
		if (req.body.username) user.username = req.body.username;
		if (req.body.password) user.password = req.body.password;
		// save the user
		user.save(function(err) {
			if (err) res.send(err);
			else res.send({ message: 'User updated!' });
		});
	});
	next();	
}

//save User
function saveUser(req, res, next) {
	var user = new User();		// create a new instance of the User model
	user.name = req.body.name;  // set the users name (comes from the request)
	user.username = req.body.username;  // set the users username (comes from the request)
	user.password = req.body.password;  // set the users password (comes from the request)	
	user.save(function(err) {
		if (err) {			
			if (err.code == 11000) 
				res.send(new restify.errors.ConflictError("A user with that username already exists.")); 
			else 
				res.send(err);
			return next();
		}
		// return a message
		res.send({ message: 'User created!' });
	});
	next();
}

//delete User
function deleteUser(req, res, next){
	User.remove({_id: req.params.user_id}, function(err, user) {
		if (err) return res.send(err);
		res.send({ message: 'Successfully deleted' });
	});
	next();	
}

//Routes
server.get('/users', getUsers);
server.post('/users', saveUser);
server.get('/users/:user_id', getUser);
server.put('/users/:user_id', updateUser);
server.del('/users/:user_id', deleteUser);

server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});

console.log(port + ' is the magic port!');