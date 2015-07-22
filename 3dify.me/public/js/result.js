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
	listen('currentprogress', updateProgress);
	currentStatusVM = new statusVM(jobid, currentjob, currentprogress);
	// Activates knockout.js
	ko.applyBindings(currentStatusVM);
});

function updateStatus(job) {
	currentStatusVM.updateJob(job);
}

function updateProgress(progress) {
	currentStatusVM.updateProgress(progress);
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

function statusVM(id, job, progress) {
	this.jobID = id;
	this.maxProgress = 8;
	this.currentJob = ko.observable(parseInt(job));
	this.currentProgress = ko.observable(parseInt(progress));
	this.currentStatus = ko.observable('Getting status...');
	this.displayModel = ko.observable(false);
	this.modelURL = ko.observable('');
	
    this.updateJob = function(job) {
    	this.currentJob(parseInt(job));
    }
    
    this.updateProgress = function(progress) {
    	this.currentProgress(parseInt(progress));
    }
    
    this.progressPercent = ko.computed(function() {
        return Math.round(this.currentProgress() / this.maxProgress * 100);
    }, this);
    
    this.displayProgress = ko.computed(function() {
    	if (this.currentJob() < this.jobID) {
    		return false;
		} else if (this.currentJob() == this.jobID) { // Ongoing
			if (this.progressPercent == 100) {
				stop('currentprogress');
				stop('currentjob');
				leave('resultwatch');
				this.modelURL('/uploads/' + iid + '/coloredmodel.x3d');
				this.displayModel(true);
				return false;
			} else {
				return true;
			}
		} else if (this.currentJob() > this.jobID) { // Finished
			stop('currentprogress');
			stop('currentjob');
			leave('resultwatch');
			this.modelURL('/uploads/' + iid + '/coloredmodel.x3d');
			this.displayModel(true);
			return false;
		}
    }, this);
    
    this.progressMessage = ko.computed(function() {
    	switch(this.currentProgress()) {
		    case 1:
		        return "Preparing photos...";
		        break;
		    case 2:
		        return "Matching features...";
		        break;
		    case 3:
		        return "Doing bundle adjustments...";
		        break;
		    case 4:
		        return "Converting to PMVS format...";
		        break;
		    case 5:
		        return "Generating dense point cloud...";
		        break;
		    case 6:
		        return "Reconstructing surface model based on dense point cloud...";
		        break;
		    case 7:
		        return "Transferring color from dense point cloud to surface model...";
		        break;
		    case 8:
		        return "Saving files...";
		        break;
		    default:
		        return "Job progress error!";
		}
    }, this);
}