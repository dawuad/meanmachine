var assert = require('assert');
var restify = require('restify');

var server = restify.createServer();

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

var count = 0;

server.use(function foo(req, res, next) {
    count++;
    next();
});

server.get('/foo/:id', function (req, res, next) {
   next('foo2');
});

server.get({
    name: 'foo2',
    path: '/foo/:id'
}, function (req, res, next) {
   assert.equal(count, 1);
   res.send(200);
   next();
});