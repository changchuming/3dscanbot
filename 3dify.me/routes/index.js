
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
	var form = new formidable.IncomingForm(),
            //files = [],
            //fields = [],
            //returnJson = {},
            iid;
	
	form.keepExtensions = true;
	form.multiples = true;
	form.on('field', function(name, value) {
		//fields.push([name, value]);
		if (name='iid') {
			form.uploadDir = "./public/uploads/"+value;
			iid = value;
		}
	});
    form.on ('fileBegin', function(name, file){
			var fileType = file.type.split('/').pop();
            if(fileType == 'jpg' || fileType == 'jpeg' ){
                //rename the incoming file to the current timestamp
            	file.path = form.uploadDir + "/" + Date.now() + ".jpg";
            } else {
                file.path = form.uploadDir + "/" + Date.now() + "." + fileType;
            }
    })
    .on('file', function(name, file) {
            //on file received
            //files.push([name, file]);
            var fileType = file.type.split('/').pop();
            if(fileType == 'jpg' || fileType == 'jpeg' ){
            	app.io.room('iid'+iid).broadcast('addpic', file.path.replace('public', ''));
            }
        })
    
    form.parse(req);
    res.send('done');
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

//##############################################################################################
//Display about page
//##############################################################################################
exports.about = function(req, res){
	res.render('about');
};