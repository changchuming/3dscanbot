/*
 * GET the result of a schedule.
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
  				jobid: reply
  			});
		}
	});
};



//Joins a room
app.io.route('join', function(req) {
	console.log('Client joined room ' + req.data);
    req.io.join(req.data);
	// Broadcast current job
	if (req.data == 'jobwatch') {
	  	redisClient.get('currentjob', function(err, reply) {
	  		app.io.room('jobwatch').broadcast('currentjob', reply);
	  		console.log('Current job is ' + reply)
  		});
	}
	else {
	  	redisClient.get('progress', function(err, reply) {
	  		app.io.room(req.data).broadcast('progress', reply);
  		});
	}
})

// Leaves a room
app.io.route('leave', function(req) {
    req.io.leave(req.data);
})


// broadcasts to a room
var broadcastResult = function(result) {
    // Get something then broadcasts it
	//app.io.room(result).broadcast('something', data);
}