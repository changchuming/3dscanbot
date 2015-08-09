 var io;
 var currentJobVM;
 
//Initialization
$(function () {
	currentJobVM = new jobVM(iid); // Create VM of pis
	connect(); // Connect to server
	// Watch and listen
	join('iid'+iid);
	listen('addpic', addPic);
	listen('setjobid', setJobID);
	// Activates knockout.js
	ko.applyBindings(currentJobVM);
});

$(document).on('change', '.btn-file :file', function() {
	//var input = $(this),
    //    numFiles = input.get(0).files ? input.get(0).files.length : 1,
    //    label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    $('input[name=iid]').val(currentJobVM.iID);
    $('form#upload-form').submit();
});

// Connect to server
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

// Add picture to current job
function addPic(data) {
	currentJobVM.addPic(data);
}

// Set the job id
function setJobID(data) {
	currentJobVM.setJobID(data);
}

//##############################################################################################
// View model for this job
//##############################################################################################
function jobVM(id) {
	this.iID = id;
    this.picArray = ko.observableArray();
    
    this.addPic = function(url) {
    	this.picArray.push(new picVM(url, this));
    }
    
    this.removePic = function(url) {
    	io.emit('removepic', url);
    	this.picArray.remove(function(pic) {return pic.url() == url});
    }
    
    this.processJob = function() {
    	io.emit('processjob', this.iID);
    }
    
    this.setJobID = function(jobid){
		window.location.href = jobid;
    }
}

//##############################################################################################
// View model for each picture
//##############################################################################################
function picVM(data, vm) {
	this.url = ko.observable(data);
	this.jobVM = vm;
	
    this.removePic = function() {
    	this.jobVM.removePic(this.url());
    }
}