//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
// Express.io, combination of express and socket.io
var express = require('express.io'); 
var app = module.exports = express();
app.http().io();
// Serve-favicon, module to display favicon
var favicon = require('serve-favicon'); 
app.use(favicon(__dirname + '/public/images/favicon.ico'));
// Redis, database module
var redis = require('redis')
redisClient = redis.createClient();
// Kue, queueing module
var kue = require('kue');
// Standard stuff
app.configure(function(){
	  app.use(express.bodyParser());
	  app.use(app.router);
	});
var http = require('http');
var path = require('path');
var formidable = require('formidable');

//----------------------------------------------------------------------------------------------
// Routes
//----------------------------------------------------------------------------------------------
var routes = require('./routes');
var result = require('./routes/result');
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

//----------------------------------------------------------------------------------------------
//Create job queue
//----------------------------------------------------------------------------------------------
var jobs = kue.createQueue();

function newJob (){
	 var job = jobs.create('queue');
	 job.save();
	}

jobs.process('queue', function (job, done){
	 console.log('Job', job.id, 'is done');
	 done && done();
	})
	
setInterval(newJob, 3000);


//----------------------------------------------------------------------------------------------
//Create file upload form
//----------------------------------------------------------------------------------------------
http.createServer(function(req, res) {
	  /* Process the form uploads */
	  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
	    var form = new formidable.IncomingForm();
	    form.parse(req, function(err, fields, files) {
	      res.writeHead(200, {'content-type': 'text/plain'});
	      res.write('received upload:\n\n');
	      res.end(util.inspect({fields: fields, files: files}));
	    });
	 
	    return;
	  }
	 
	  /* Display the file upload form. */
	  res.writeHead(200, {'content-type': 'text/html'});
	  res.end(
	    '<form action="/upload" enctype="multipart/form-data" method="post">'+
	    '<input type="text" name="title"><br>'+
	    '<input type="file" name="upload" multiple="multiple"><br>'+
	    '<input type="submit" value="Upload">'+
	    '</form>'
	  );
	 
	}).listen(8080);

//##############################################################################################
// Display landing page
//##############################################################################################
app.get('/', routes.index);

//##############################################################################################
//Display result of run
//##############################################################################################
app.get('/:result', result.display);