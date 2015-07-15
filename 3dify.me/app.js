//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
// Express.io, combination of express and socket.io
var express = require('express.io'); 
var app = module.exports = express();
app.http().io();
// Serve-favicon, module to display favicon
var favicon = require('serve-favicon'); 
app.use(favicon(__dirname + '/public/img/favicon.ico'));
// Redis, database module
var redis = require('redis')
redisClient = redis.createClient();
// Standard stuff
app.configure(function(){
	  app.use(express.bodyParser());
	  app.use(app.router);
	});
var http = require('http');
var path = require('path');

//----------------------------------------------------------------------------------------------
// Queue
//----------------------------------------------------------------------------------------------
var queue = require('./modules/queue');
queue.initialize();
queue.process();

//----------------------------------------------------------------------------------------------
// Routes
//----------------------------------------------------------------------------------------------
var index = require('./routes');
var result = require('./routes/result');
var pi = require('./routes/pi');

//----------------------------------------------------------------------------------------------
// Express - All environments
//----------------------------------------------------------------------------------------------
app.set('port', process.env.PORT || 44444);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//----------------------------------------------------------------------------------------------
// Development only
//----------------------------------------------------------------------------------------------

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//----------------------------------------------------------------------------------------------
// Error handling if we are unable to connect to redis
//----------------------------------------------------------------------------------------------

redisClient.on("error", function (err) {
	console.log("Redis server cannot be reached.");
	});

//----------------------------------------------------------------------------------------------
// Create server and listen to port
//----------------------------------------------------------------------------------------------

app.listen(app.get('port'), function(){
   console.log("Express server listening on port " + app.get('port'));
});

//----------------------------------------------------------------------------------------------
// Socket routes
//----------------------------------------------------------------------------------------------

//Joins a room
app.io.route('join', function(req) {
    req.io.join(req.data);
	result.joincb(req.data);
	pi.joincb(req.data);
})

// Leaves a room
app.io.route('leave', function(req) {
    req.io.leave(req.data);
})

// Special case when pi connects
app.io.route('pijoin', function(req) {
    pi.pijoin(req);
})

// Special case when pi leaves
app.io.route('pileave', function(req) {
    pi.pileave(req);
})

// Set new job with iid for pi
app.io.route('newjob', function(req) {
    pi.newjob(req);
})

// Asks a certain pi to take a picture
app.io.route('takepic', function(req) {
    pi.takepic(req);
})

// Asks a certain pi to take a picture
app.io.route('addpic', function(req) {
    pi.takepic(req);
})

// Remove picture from database
app.io.route('removepic', function(req) {
    pi.takepic(req);
})

// Remove picture from database
app.io.route('piip', function(req) {
    console.log(req.data);
})

//##############################################################################################
// Display landing page
//##############################################################################################
app.get('/', index.display);
app.get('/upload', index.upload);

//##############################################################################################
// Display pi landing page
//##############################################################################################
app.get('/pi', pi.display)

//##############################################################################################
// Display result of run
//##############################################################################################
app.get('/:jobid', result.display);