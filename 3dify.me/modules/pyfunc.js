//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var child = require('child_process');

exports.reconstruct = function(job) {
	python = child.spawn(
		'python',
    	['-u' , // unbuffered output
    	'/home/ubuntu/3dscanbot/osm-bundler/linux/RunBundlerPMVSMeshlab.py', // script
    	'--photos=/home/ubuntu/3dscanbot/uploads/' + job] // parameters
    );
    
    var output = "";
    
    python.stdout.on('data', function(data){
    	dataString = data.toString();
    	if (dataString.indexOf("ProgressPercent:") > -1) {
    		app.io.room(job).broadcast('progress', dataString);
    		//res.write(dataString);
    		//output += data;
    	}
	});
	
    python.on('close', function(code){ 
    	if (code !== 0) {
    		app.io.room(job).broadcast('error', code);
    		//return res.send(500, code);
		}
		app.io.room(job).broadcast('success', output);
    	//return res.send(200, output)
    	//return res.end();
    });
}