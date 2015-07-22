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
  	redisClient.hget('jobs', req.params.jobid, function(err, iid){
		// If schedule invalid
		if (iid == null) {
			res.send('Invalid link.');
		}
		// Else display schedule
		else {
		  	redisClient.get('currentjob', function(err, currentjob) {
  			  	redisClient.get('currentprogress', function(err, currentprogress) {
	  	  			res.render('result', {
	  				title: iid,
	  				iid: iid,
	  				jobid: req.params.jobid,
	  				modelname: iid,
	  				currentjob: currentjob,
	  				currentprogress: currentprogress
  			});
		  		});
	  		});
		}
	});
};