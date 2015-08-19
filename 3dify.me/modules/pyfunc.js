//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var child = require('child_process');
var MAX_PROGRESS = 8;

//##############################################################################################
// Run python reconstruction on specific job
//##############################################################################################
exports.reconstruct = function(jobid, iid, done) {

	// Tells server and client which job is current processing
	// Set current progress to 0 for server and client
	app.io.room('resultwatch').broadcast('currentprogress', 1);
	redisClient.set('currentprogress', 1, function(err,reply) {
		console.log('currentprogress is ' + 1);
	})
	app.io.room('resultwatch').broadcast('currentjob', job.id);
	redisClient.set('currentjob', jobid, function(err,reply) {
		console.log('Job ' + jobid + ': ' + iid + ' is now processing');
	})
		
	python = child.spawn(
		'python',
    	['-u' , // unbuffered output
    	'/home/ubuntu/3dscanbot/osm-bundler/linux/RunBundlerPMVSMeshlab.py', // script
    	'--photos=/home/ubuntu/3dscanbot/3dify.me/public/uploads/' + iid] // parameters
    );
    
    var output = "";
    
    python.stdout.on('data', function(data){
    	progressString = data.toString();
    	if (progressString.indexOf("###") > -1) {
    		progressString = progressString.replace(/\D/g,'');
    		progressNum = parseInt(progressString);
    		app.io.room('resultwatch').broadcast('currentprogress', progressNum);
    		redisClient.set('currentprogress', progressNum, function(err,reply) {
    			console.log('currentprogress is ' + progressNum);
    		})
    	}
	});
	
    python.on('close', function(code){ 
    	if (code !== 0) {
    		// If error
		}
		else {
			// No error
		}
		console.log('Job is done.');
		app.io.room('resultwatch').broadcast('currentprogress', MAX_PROGRESS);
		redisClient.set('currentprogress', MAX_PROGRESS, function(err,reply) {
			console.log('currentprogress is ' + MAX_PROGRESS);
		})
		done();
    });
}