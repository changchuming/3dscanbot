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
//Display results of a reconstruction
//##############################################################################################
exports.display = function(req, res){
	console.log('display ' + req.params.jobname);
  	queue.newJob(req.params.jobname);
  	redisClient.hget('jobs', req.params.jobname, function(err, reply){
		// If schedule invalid
		if (reply == null) {
			res.send('Invalid link.');
		}
		// Else display schedule
		else {
  			res.render('result', {
  				title: req.params.jobname,
  				jobname: JSON.stringify(req.params.jobname),
  				jobid: reply,
  				modelname: req.params.jobname
  			});
		}
	});
};

exports.callback = function(req) {
    req.io.join(req.data);
	// Broadcast current job
	if (req.data == 'resultwatch') {
	  	redisClient.get('currentjob', function(err, reply) {
	  		app.io.room('resultwatch').broadcast('currentjob', reply);
	  		console.log('Current job is ' + reply)
  		});
	}
	else if (req.data == 'resultwatch') {
	  	redisClient.get('currentprogress', function(err, reply) {
	  		app.io.room('resultwatch').broadcast('currentprogress', reply);
  		});
	}
}
	
// broadcasts to a room
var broadcastResult = function(result) {
    // Get something then broadcasts it
	//app.io.room(result).broadcast('something', data);
}