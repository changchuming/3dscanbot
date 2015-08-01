/**
 * New node file
 */

var io;
var currentPiArrayVM;

//Initialization
$(function () {
	currentPiArrayVM = new piArrayVM(); // Create VM of pis
	connect(); // Connect to server
	// Watch and listen for pi connects and disconnect
	join('piwatch');
	listen('pijoin', addPi);
	listen('pileave', removePi);
	listen('addpic', addPic);
	listen('setiid', setIID);
	listen('setjobid', setJobID);
	// Add all existing pis
	for (var piid in pis) {
		addPi({piid: piid, piname: pis[piid]});
	}
	// Activates knockout.js
	ko.applyBindings(currentPiArrayVM);
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

// Add pi to piArray
function addPi(data) {
	currentPiArrayVM.addPiVM(data);
}

// Remove pi from piArray
function removePi(data) {
	currentPiArrayVM.removePiVM(data);
}

// Add picture to specific pi
function addPic(data) {
	console.log(data);
	ko.utils.arrayForEach(currentPiArrayVM.piArray(), function(eachPiVM) {
        if (eachPiVM.piID() == data.piid) {
        	eachPiVM.addPic(data.url);
        }
    });
}

// Set the job iid of a certain pi
function setIID(data) {
	ko.utils.arrayForEach(currentPiArrayVM.piArray(), function(eachPiVM) {
        if (eachPiVM.piID() == data.piid) {
        	eachPiVM.setIID(data.iid);
        }
    });
}

// Set the job iid of a certain pi
function setJobID(data) {
	ko.utils.arrayForEach(currentPiArrayVM.piArray(), function(eachPiVM) {
        if (eachPiVM.piID() == data.piid) {
        	eachPiVM.setJobID(data.jobid);
        }
    });
}

//##############################################################################################
// View model for array of pis
//##############################################################################################
function piArrayVM() {
	this.piArray = ko.observableArray();
	// Add pi
	this.addPiVM = function(data) {
		this.piArray.push(new piVM(data));
	}
	// Remove pi whith certain piid
	this.removePiVM = function(piid) {
		this.piArray.remove(function(pi) {return pi.piID() == piid});
	}
}

//##############################################################################################
// View model for pi
//##############################################################################################
function piVM(data) {
	this.iID = 0;
    this.piID = ko.observable(data.piid);
    this.piName = ko.observable(data.piname);
    this.picArray = ko.observableArray();
    this.hasJob = ko.observable(false);
    
    this.setIID = function(iid){
    	this.iID = iid;
    }
    
    this.setJobID = function(jobid){
    	var siteURL = $(location).attr('href').substring(0, $(location).attr('href').lastIndexOf("/"));
		window.location.href = siteURL+jobid;
    }
    
    this.newJob = function() {
    	this.hasJob(true);
		join('piid'+this.piID()); // Join pi room
		io.emit('newjob', this.piID()); // Requests server for a new job
    }

    this.discardJob = function() {
    	this.hasJob(false);
    	this.picArray.removeAll();
    	leave('piid'+this.piID()); // Leave pi room
    }
        
    this.processJob = function() {
    console.log(this.iID);
    	io.emit('processjob', {piid: this.piID(), iid: this.iID});
    }

    this.takePic = function(){
    	io.emit('takepic', this.piID());
    	//this.addPic('../img/intro-bg.jpg')
    }
    
    this.addPic = function(url) {
    	this.picArray.push(new picVM(url, this));
    }

    this.removePic = function(url) {
    	io.emit('removepic', url);
    	this.picArray.remove(function(pic) {return pic.url() == url});
    }
    
    this.piHalt = function() {
    	io.emit('pihalt', this.piID());
    }

    this.fullName = ko.computed(function() {
        return this.piID() + " " + this.piName();    
    }, this);
}

//##############################################################################################
// View model for each picture
//##############################################################################################
function picVM(data, vm) {
	this.url = ko.observable(data);
	this.piVM = vm;
	
    this.removePic = function() {
    	this.piVM.removePic(this.url());
    }
}