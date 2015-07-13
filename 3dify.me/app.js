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
var redis = require('redis');
var redisClient = redis.createClient();
// Kue, queueing module
var kue = require('kue');
// Standard stuff
app.configure(function(){
	  app.use(express.bodyParser());
	  app.use(app.router);
	});
var http = require('http');
var path = require('path');
var multer  = require('multer');
var done = false;

//----------------------------------------------------------------------------------------------
// Routes
//----------------------------------------------------------------------------------------------
var index = require('./routes');
var result = require('./routes/result');
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
app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...');
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path);
  done=true;
}
}));
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
//Create job queue - should be moved to index.js
//----------------------------------------------------------------------------------------------
//var jobs = kue.createQueue();
//
//jobs.process('reconstruction', function (job, done){
//	 console.log('Job', job.id, 'is done');
//	 done && done();
//	})
//
//function newJob (){
//	 var job = jobs.create('reconstruction');
//	 job.save();
//	}

//##############################################################################################
// Display landing page
//##############################################################################################
app.get('/', index.display);

//##############################################################################################
//Display result of run
//##############################################################################################

app.post('/api/photo',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});

app.listen(44444,function(){
    console.log("Working on port 44444");
});

//app.post('/upload', index.upload);

//app.get('/show', index.show)

//app.get('/upload', index.upload);


//##############################################################################################
//Display result of run
//##############################################################################################
app.get('/:result', result.display);