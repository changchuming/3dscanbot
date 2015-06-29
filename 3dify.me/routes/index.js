
/*
 * GET home page.
 */
 
//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var execPipe = require('../modules/execpipe');
var jobs = app.jobs;
 
//##############################################################################################
// Display home page
//##############################################################################################
exports.index = function(req, res){
  res.render('index', {
	  title: '3Dify'
  });
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
	execPipe('/home/ubuntu/3dscanbot/osm-bundler/examples/ET');
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