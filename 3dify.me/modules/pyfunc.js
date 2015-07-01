var child = require('child_process');

exports.reconstruct = function(folderPath, res) {
	python = child.spawn(
		'python',
    	["/home/ubuntu/3dscanbot/osm-bundler/linux/RunBundlerPMVSMeshlab.py" // script
    	, "--photos=" + folderPath] // parameters
    );
    
    var output = "";
    
    python.stdout.on('data', function(data){
    	dataString = data.toString();
    	if (dataString.indexOf("Percent%:") > -1) {
    		res.write(dataString);
    	}
    	//output += data;
	});
	
    python.on('close', function(code){ 
    	//if (code !== 0) {
    	//	return res.send(500, code);
		//}
    	//return res.send(200, output)
    	return res.end();
    });
}