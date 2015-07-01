var PythonShell = require('python-shell');

var execPipe = function(inputFolder, callback) {
	var input = {options: {}};
	var output = {};
	input.options = {
	        mode: 'text',
	        pythonPath: 'python',
	        pythonOptions: ['-u'],
	        scriptPath: '/home/ubuntu/3dscanbot/osm-bundler/linux/',
	        args: ['--photos=' + inputFolder]
	};
	input.pyscript = 'RunBundlerPMVS.py';
	execPy(input, output, callback);
};


var execPy = function(input, output, callback) {
    var pyShell = new PythonShell(input.pyscript, input.options);
    output.messages = [];

    pyShell.on('message', function (message) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log('Python script:', input.pyscript, 'says', message);
        output.messages.push(message);
    });

    // end the input stream and allow the process to exit
    pyShell.end(function (err) {
        output.err = err;
        console.log('Python script finished executing.');
        if (err){
            return callback(err);
        }
    });
    //callback(null, output);
};

module.exports = execPipe;