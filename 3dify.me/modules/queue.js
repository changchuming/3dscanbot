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
			console.log('Job ' + job.id + ': ' + job.data.iid + ' is now processing');
		})
		// Start python reconstruction
		pyfunc.reconstruct(job.data.iid, done);
	})
}

// Create job
exports.newJob = function (iid){
	 var job = jobs.create('reconstruct', {
	 	iid: iid});
	 job.save( function(err){
		 if (!err) {
		 	redisClient.hset('jobs', job.id, iid, function(err, reply) {
		 		 console.log('Job ' + job.id + ': ' + iid + ' saved');
		 		 //res.send({reply: reply});
		 	 });
	 	 } else {
	 	 	console.log('Error saving job!');
	 	 }
	 });
}