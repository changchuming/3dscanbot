/**
 * New node file
 */

var io;
var currentStatusVM;

//Initialization
$(function () {
	connect();
	join('resultwatch');
	listen('currentjob', updateStatus);
	currentStatusVM = new statusVM();
	// Activates knockout.js
	ko.applyBindings(currentStatusVM);
});

function updateStatus(currentjob) {
	alert(currentjob);
	alert(jobid);
	if (currentjob < jobid) { // In queue
		// Display place in queue
	} else if (currentjob == jobid) { // Ongoing
		stop('currentjob');
		listen('currentprogress', updateProgress);
	} else if (currentjob > jobid) { // Finishe
		leave('resultwatch');
		renderModel();
	}
}

function updateProgress(data) {
	if (data == 'done') {
		stop('currentprogress');
		leave('resultwatch');
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

function statusVM() {
	this.currentStatus = ko.observable('Getting status...');
}