
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
 
//##############################################################################################
// Display home page
//##############################################################################################
exports.display = function(req, res){

	console.log('index');
	
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