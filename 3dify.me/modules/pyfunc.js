//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var child = require('child_process');
var MAX_PROGRESS = 8;

//##############################################################################################
// Run python reconstruction on specific job
//##############################################################################################
exports.reconstruct = function(iid, done) {
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
		setTimeout(function() {
			console.log('Job is done.');
			app.io.room('resultwatch').broadcast('currentprogress', MAX_PROGRESS);
		}, 3000);
		redisClient.set('currentprogress', MAX_PROGRESS, function(err,reply) {
			console.log('currentprogress is ' + MAX_PROGRESS);
		})
		done();
    });
}