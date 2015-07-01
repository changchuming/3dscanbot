/**
 * New node file
 */

var io;

//Initialization
$(function () {
	connect();
	join('jobwatch');
	listen('currentjob', updateStatus);
});

function updateStatus(currentjob) {
	alert(currentjob);
	alert(jobid);
	if (currentjob < jobid) { // In queue
		// Display place in queue
	} else if (currentjob == jobid) { // Ongoing
		leave('jobwatch');
		join(jobname);
		listen('progress', updateProgress);
	} else if (currentjob > jobid) { // Finishe
		leave('jobwatch');
		renderModel();
	}
}

function updateProgress(data) {
	if (data == 'done') {
		leave(jobname);
		renderModel();
	}
}

function renderModel() {
	alert('Render something!');
}

function connect() {
	io = io.connect();
}

// Join room
function join(room) {
	io.emit('join', room);
}

// Leave room
function leave(room) {
	io.emit('leave', room);
} 

// Listen for event and provides callback
function listen(event, callback) {
	io.on(event, function(data) {
	    callback(data);
	})
}

// Stop listening for event
function stop(event, callback) {
	io.removeListener(event, callback);
}