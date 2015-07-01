/**
 * New node file
 */

var io;

//Initialization
$(function () {
	alert(job);
	connect();
	join(job);
	listen('progress', function (data){
		alert(data);
	});
});

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