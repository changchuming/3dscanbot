//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var child = require('child_process');

//##############################################################################################
// Run python reconstruction on specific job
//##############################################################################################
exports.reconstruct = function(jobID) {
	console.log('reconstructing ' + jobID);
	python = child.spawn(
		'python',
    	['-u' , // unbuffered output
    	'/home/ubuntu/3dscanbot/osm-bundler/linux/RunBundlerPMVSMeshlab.py', // script
    	'--photos=/home/ubuntu/3dscanbot/uploads/' + jobID] // parameters
    );
    
    var output = "";
    
    python.stdout.on('data', function(data){
    	dataString = data.toString();
    	if (dataString.indexOf("Progress: ") > -1) {
    		console.log(dataString);
    		app.io.room(jobID).broadcast('progress', dataString);
    		//res.write(dataString);
    		//output += data;
    	}
	});
	
    python.on('close', function(code){ 
    	if (code !== 0) {
    		app.io.room(jobID).broadcast('error', code);
    		//return res.send(500, code);
		}
		app.io.room(jobID).broadcast('success', output);
    	//return res.send(200, output)
    	//return res.end();
    });
}