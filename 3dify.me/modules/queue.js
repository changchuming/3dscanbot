// Dependencies
var app = require('../app');
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
		// Tells server and client which job is current processing
		// Set current progress to 0 for server and client
		app.io.room('resultwatch').broadcast('currentprogress', 1);
		redisClient.set('currentprogress', 1, function(err,reply) {
			console.log('currentprogress is ' + 1);
		})
		app.io.room('resultwatch').broadcast('currentjob', job.id);
		redisClient.set('currentjob', job.id, function(err,reply) {
			console.log('Job ' + job.id + ': ' + job.data.iid + ' is now processing');
		})
		// Start python reconstruction
		pyfunc.reconstruct(job.data.iid, done);
	})
}

// Create job
exports.newJob = function (iid, callback){
	 var job = jobs.create('reconstruct', {
	 	iid: iid});
	 job.save( function(err){
		 if (!err) {
		 	redisClient.hset('jobs', job.id, iid, function(err, reply) {
		 		 console.log('Job ' + job.id + ': ' + iid + ' saved');
		 		 callback(job.id);
		 	 });
	 	 } else {
	 	 	console.log('Error saving job!');
	 	 }
	 });
}