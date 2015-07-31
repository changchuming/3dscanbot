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
var formidable = require('formidable');

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
// Socket routes
//----------------------------------------------------------------------------------------------

//Joins a room
app.io.route('join', function(req) {
    req.io.join(req.data);
	result.joincb(req.data);
	pi.joincb(req.data);
});

// Leaves a room
app.io.route('leave', function(req) {
    req.io.leave(req.data);
});

// Special case when pi connects
app.io.route('pijoin', function(req) {
    pi.pijoin(req);
});

// Set new job with iid for pi
app.io.route('newjob', function(req) {
    pi.newjob(req);
});

// Asks a certain pi to take a picture
app.io.route('takepic', function(req) {
    pi.takepic(req);
});

// Asks a certain pi to add a picture
app.io.route('addpic', function(req) {
    pi.addpic(req);
});

// Remove picture from database
app.io.route('removepic', function(req) {
    pi.removepic(req);
});

// Remove picture from database
app.io.route('processjob', function(req) {
    pi.processjob(req);
});

// Halt / shutdown a pi
app.io.route('pihalt', function (req) {
	pi.pihalt(req);
});

// Show connected pi's ip
app.io.route('piip', function(req) {
    console.log(req.data);
});

//##############################################################################################
// Display landing page
//##############################################################################################
app.get('/', index.display);
app.get('/upload', index.upload);

//##############################################################################################
// Logic to upload photos
//##############################################################################################

app.post('/upload', function (req, res) {

	index.upload(req,res);
		
	/*
    var form = new formidable.IncomingForm;
    // form.uploadDir = "./upload";
    console.log(form.uploadDir);

    form.parse(req, function(err, fields, files){
      if (err) return res.end('You found error');
      console.log(files.image);
    });

    form.on('progress', function(bytesReceived, bytesExpected) {
        console.log(bytesReceived + ' ' + bytesExpected);
    });

    form.on('error', function(err) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('error:\n\n'+util.inspect(err));
    });

    // res.end('Done');
    res.send("well done");

    return;
    */
});

/*
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
*/


//##############################################################################################
// Display pi landing page
//##############################################################################################

app.get('/pi', pi.display);

//##############################################################################################
// Display result of run
//##############################################################################################

/*
app.get('/:jobname', result.display);
//app.get('/r/:result', result.display);

*/

app.get('/:jobid', result.display);

