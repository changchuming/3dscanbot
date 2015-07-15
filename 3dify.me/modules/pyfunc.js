//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var child = require('child_process');

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
    	dataString = data.toString();
    	if (dataString.indexOf("Progress: ") > -1) {
    		app.io.room('resultwatch').broadcast('currentprogress', dataString);
    		redisClient.set('currentprogress', dataString, function(err,reply) {
    			console.log(dataString);
    		})
    		//res.write(dataString);
    		//output += data;
    	}
	});
	
    python.on('close', function(code){ 
    	if (code !== 0) {
    		app.io.room('resultwatch').broadcast('error', code);
		}
		app.io.room('resultwatch').broadcast('currentprogress', 'done');
		redisClient.set('currentprogress', 'done', function(err,reply) {
			console.log('Progress: Done');
			done();
		})
    });
}