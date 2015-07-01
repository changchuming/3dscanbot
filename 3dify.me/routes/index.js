
/*
 * GET home page.
 */
 
//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var execPipe = require('../modules/execpipe');
var async = require('async');
var pyfunc = require('../modules/pyfunc'); 
var jobs = app.jobs;
var photoUploader = require('../modules/photouploader');
 
//##############################################################################################
// Display home page
//##############################################################################################
exports.display = function(req, res){

	console.log('index');
  	
  	//commenting out the main index page
  	//res.render('index', {
	//  	title: '3Dify'
  	//});
  	
  	photoUploader.start(req, res);
  	
  	/*var options = {
	  scriptPath: '/home/ubuntu/3dscanbot/osm-bundler/linux',
	  args: ['--photos="./examples/ET"']
	};
	PythonShell.run('RunBundlerPMVSMeshlab.py', options, function (err, results) {
  		if (err) throw err;
  		// results is an array consisting of messages collected during execution 
  		console.log('results: %j', results);
  	});*/

};

//##############################################################################################
//Uploads files and adds to queue
//##############################################################################################
exports.upload = function(req, res){
	
	/*console.log('script run');
	var callback = function(err, result) {
	    if (err) {
	        console.log('Error in Python Script:');
	        throw err;
	    }
	    console.log('called back with result:', result);
	};
	async.parallel([async.apply(execPipe, '/home/ubuntu/3dscanbot/osm-bundler/examples/ET')], callback);
	*/
	
	photoUploader.upload(req, res);

};

exports.show = function(req, res){
	/*console.log('script run');
	var callback = function(err, result) {
	    if (err) {
	        console.log('Error in Python Script:');
	        throw err;
	    }
	    console.log('called back with result:', result);
	};
	async.parallel([async.apply(execPipe, '/home/ubuntu/3dscanbot/osm-bundler/examples/ET')], callback);
	*/
	
	photoUploader.show(req, res);

	console.log('script run');
	pyfunc.reconstruct("/home/ubuntu/3dscanbot/osm-bundler/examples/ET", res);
	//execPipe.execPipe('/home/ubuntu/3dscanbot/osm-bundler/examples/ET');
//	var options = {
//	  scriptPath: '/home/ubuntu/3dscanbot/osm-bundler/linux',
//	  args: ['--photos=/home/ubuntu/3dscanbot/osm-bundler/examples/ET']
//	};
//	PythonShell.run('RunBundlerPMVS.py', options, function (err, results) {
//  		if (err) throw err;
//  		// results is an array consisting of messages collected during execution 
//  		console.log('results: %j', results);
//  	});

	
	//async.parallel([async.apply(execPipe, '/home/ubuntu/3dscanbot/osm-bundler/examples/ET')], callback);

};

//##############################################################################################
//Uploading of files
//##############################################################################################
/*
http.createServer(function(req, res) {
	  //Process the form uploads
	  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
	    var form = new formidable.IncomingForm();
	    form.parse(req, function(err, fields, files) {
	      res.writeHead(200, {'content-type': 'text/plain'});
	      res.write('received upload:\n\n');
	      res.end(util.inspect({fields: fields, files: files}));
	    });
	 
	    return;
	  }
	 
	  //Display the file upload form.
	  res.writeHead(200, {'content-type': 'text/html'});
	  res.end(
	    '<form action="/upload" enctype="multipart/form-data" method="post">'+
	    '<input type="text" name="title"><br>'+
	    '<input type="file" name="upload" multiple="multiple"><br>'+
	    '<input type="submit" value="Upload">'+
	    '</form>'
	  );
	 
	}).listen(8080);
	*/