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
		// Tells server which job is current processing
		redisClient.set('currentjob', job.id, function(err,reply) {
			console.log('Job ' + job.id + ': ' + job.data.jobname + ' is now processing');
		})
		// Start python reconstruction
		pyfunc.reconstruct(job.data.jobname);
		console.log('Job ' + job.id + ': ' + job.data.jobname + ' is done processing');
		done && done();
	})
}

// Create job
exports.newJob = function (jobname){
	 var job = jobs.create('reconstruct', {
	 	jobname: jobname});
	 job.save( function(err){
		 if (!err) {
		 	redisClient.hset('jobs', jobname, job.id, function(err, reply) {
		 		 console.log('Job ' + job.id + ': ' + jobname + ' saved');
		 		 //res.send({reply: reply});
		 	 });
	 	 } else {
	 	 	console.log('Error saving job!');
	 	 }
	 });
}