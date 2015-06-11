//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var express = require('express.io');
var app = module.exports = express();
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});
app.http().io();
var http = require('http');
var path = require('path');
var redis = require('redis')
redisClient = redis.createClient();

//----------------------------------------------------------------------------------------------
// Routes
//----------------------------------------------------------------------------------------------
var routes = require('./routes');
var user = require('./routes/users');
//----------------------------------------------------------------------------------------------
// Express - All environments
//----------------------------------------------------------------------------------------------
app.set('port', process.env.PORT || 80);
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

//##############################################################################################
// Display home page
//##############################################################################################
app.get('/', routes.index);
//app.get('/users', user.list);