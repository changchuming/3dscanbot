// Dependencies
var kue = require('kue');
var pyfunc = require('./pyfunc');

var jobs;

// Initialize queue
exports.initialize = function () {
	jobs = kue.createQueue();
}

// Process queue
exports.process = function() {
	jobs.process('reconstruct', function (job, done){
		console.log('Job ' + job.id + ': ' + job.data.jobID + ' is now processing');
		pyfunc.reconstruct(job.data.jobID);
		console.log('Job ' + job.id + ': ' + job.data.jobID + ' is done processing');
		done && done();
	})
}

// Create job
exports.newJob = function (jobID){
	 var job = jobs.create('reconstruct', {
	 	jobID: jobID});
	 job.save( function(err){
		 if (!err) {
		 	redisClient.hset('jobs', jobID, job.id, function(err, reply) {
		 		 console.log('Job ' + job.id + ': ' + jobID + ' saved');
		 		 //res.send({reply: reply});
		 	 });
	 	 } else {
	 	 	console.log('Error saving job!');
	 	 }
	 });
}