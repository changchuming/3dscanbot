
/*
 * GET home page.
 */
 
//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var jobs = app.jobs;
var PythonShell = require('python-shell');
 
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
	var options = {
	  scriptPath: '/home/ubuntu/3dscanbot/osm-bundler/linux',
	  args: ['--photos="./examples/ET"']
	};
	PythonShell.run('RunBundlerPMVSMeshlab.py', options, function (err, results) {
  		if (err) throw err;
  		// results is an array consisting of messages collected during execution 
  		console.log('results: %j', results);
	});
	/*(if(req.files.myUpload){
		var python = require('child_process').spawn(
			'python',
			// second argument is array of parameters, e.g.:
			["/home/ubuntu/3dscanbot/linux/RunBundlerPMVSMeshlab.py"
			, req.files.myUpload.path]
		);
		var output = "";
		python.stdout.on('data', function(){ output += data });
		python.on('close', function(code){ 
		if (code !== 0) {  return res.send(500, code); }
			return res.send(200, output)
		});
	} 
	else {
		res.send(500, 'No file found') 
	}*/
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