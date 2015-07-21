/*
 * GET the result of a job.
 */

//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var pyfunc = require('../modules/pyfunc');
var queue = require('../modules/queue');

//##############################################################################################
// Display results of a reconstruction
//##############################################################################################
exports.display = function(req, res){
  	redisClient.hget('jobs', req.params.jobid, function(err, jobexists){
		// If schedule invalid
		if (jobexists == null) {
			res.send('Invalid link.');
		}
		// Else display schedule
		else {
		  	redisClient.get('currentjob', function(err, currentjob) {
  			  	redisClient.get('currentprogress', function(err, currentprogress) {
	  	  			res.render('result', {
	  				title: reply,
	  				iid: reply,
	  				jobid: req.params.jobid,
	  				modelname: reply,
	  				currentjob: currentjob,
	  				currentprogress: currentprogress
  			});
		  		});
	  		});
		}
	});
};

//##############################################################################################
// Callback when user joins results room
//##############################################################################################
exports.joincb = function(room) {
	// Broadcast current job
	if (room == 'resultwatch') {
	  	redisClient.get('currentjob', function(err, reply) {
	  		app.io.room('resultwatch').broadcast('currentjob', reply);
	  		console.log('User connected and current job is ' + reply)
  		});
	}
	else if (room == 'resultwatch') {
	  	redisClient.get('currentprogress', function(err, reply) {
	  		app.io.room('resultwatch').broadcast('currentprogress', reply);
	  		console.log('User connected and current progress is ' + reply)
  		});
	}
}
	
// broadcasts to a room
var broadcastResult = function(result) {
    // Get something then broadcasts it
	//app.io.room(result).broadcast('something', data);
}