//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var child = require('child_process');

//##############################################################################################
// Run python reconstruction on specific job
//##############################################################################################
exports.reconstruct = function(jobname) {
	console.log('reconstructing ' + jobname);
	python = child.spawn(
		'python',
    	['-u' , // unbuffered output
    	'/home/ubuntu/3dscanbot/osm-bundler/linux/RunBundlerPMVSMeshlab.py', // script
    	'--photos=/home/ubuntu/3dscanbot/uploads/' + jobname] // parameters
    );
    
    var output = "";
    
    python.stdout.on('data', function(data){
    	dataString = data.toString();
    	if (dataString.indexOf("Progress: ") > -1) {
    		app.io.room(jobname).broadcast('progress', dataString);
    		redisClient.set('progress', dataString, function(err,reply) {
    			console.log('Progress: ' + dataString);
    		})
    		//res.write(dataString);
    		//output += data;
    	}
	});
	
    python.on('close', function(code){ 
    	if (code !== 0) {
    		app.io.room(jobname).broadcast('error', code);
		}
		app.io.room(jobname).broadcast('progress', 'done');
		redisClient.set('progress', 'done', function(err,reply) {
			console.log('Progress: Done');
		})
    });
}