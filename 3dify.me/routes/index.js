
/*
 * GET home page.
 */
 
//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var async = require('async');
var queue = require('../modules/queue');
var jobs = app.jobs;
var formidable = require("formidable");
var util = require("util");
var fs = require('fs');
 
//##############################################################################################
// Display home page
//##############################################################################################
exports.display = function(req, res){
  	// commenting out the main index page
	var iid;
	redisClient.get('lastiid', function(err, reply) {
		if (reply == null) {
			iid = 1;
		} else {
			iid = parseInt(reply)+1;
		}
		fs.mkdir('public/uploads/'+iid); // Make uploads folder for this job
		redisClient.set('lastiid', iid, function (err, reply) {}); // Update last iid
	  	res.render('index', {
	  		title: '3Dify',
	  		iid: iid
	  	});
	});
};

//##############################################################################################
//Uploads files and adds to queue
//##############################################################################################
exports.upload = function(req, res){
	var form = new formidable.IncomingForm();
	
	form.keepExtensions = true;
	form.multiples = true;
	form.on('field', function(name, value) {
		if (name='iid') {
			form.uploadDir = "./public/uploads/"+value;
		}
	});
    form.parse(req, function(err, fields, files) {
      	//console.log(files);
      	if (files.upload.constructor === Array) {
      		for (file in files.upload) {
      			app.io.room('iid'+fields.iid).broadcast('addpic', files.upload[file].path.substring(files.upload[file].path.indexOf("\\")));
      		}
      	} else {
      		app.io.room('iid'+fields.iid).broadcast('addpic', files.upload.path.substring(files.upload.path.indexOf("\\")));
      	}
    });
}

//##############################################################################################
// Client calls remove pic and server removes pic
//##############################################################################################
exports.removepic = function(req) {
	try {
		fs.unlinkSync('public/'+req.data);
	} catch (ex) {
		console.log(ex);
	}
}

//##############################################################################################
// Client calls for processing job using iid and server processes
//##############################################################################################
exports.processjob = function(req) {
console.log(req.data);
	queue.newJob(req.data, function(jobid) {
		app.io.room('iid'+req.data).broadcast('setjobid', jobid);
	});
}

