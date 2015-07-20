/*
 * Pi routes
 */

//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var pyfunc = require('../modules/pyfunc');
var queue = require('../modules/queue');
var fs = require('fs');

//##############################################################################################
// Display pi landing page
//##############################################################################################
exports.display = function(req, res){
  	// commenting out the main index page
  	redisClient.hgetall('pis', function(err, reply) {
	  	res.render('pi', {
	  		pis: JSON.stringify(reply)
	  	});
	});
};

//##############################################################################################
// Callback when user connects to pi room
//##############################################################################################
exports.joincb = function(room) {
	// Broadcast when user connects
	if (room == 'piwatch') {
	  	console.log('User connected to Piwatch.');
	}
}

//##############################################################################################
// Client calls for new job and server pushes to pi
//##############################################################################################
exports.newjob = function(req) {
	var iid;
	redisClient.get('lastiid', function(err, reply) {
		if (reply == null) {
			iid = 1;
		} else {
			iid = parseInt(reply)+1;
		}
		fs.mkdir('public/uploads/'+iid); // Make uploads folder for this job
		redisClient.set('lastiid', iid, function (err, reply) {}); // Update last iid
		app.io.room('piid'+req.data).broadcast('setiid', {piid: req.data, iid: iid});
	});
}

//##############################################################################################
// Client calls for new pic and server pushes to pi
//##############################################################################################
exports.takepic = function(req) {
	app.io.room('piid'+req.data).broadcast('takepic');
}

//##############################################################################################
// Pi calls add pic and server pushes to client
//##############################################################################################
exports.addpic = function(req) {
	app.io.room('piid'+req.data.piid).broadcast('addpic', req.data);
}

//##############################################################################################
// Client calls remove pic and server removes pic
//##############################################################################################
exports.removepic = function(req) {
	try {
		fs.unlinkSync('public/'+req.data);
	} catch (ex) {
		console.log(ex);
	}
}

//##############################################################################################
// Client calls for processing job using iid and server processes
//##############################################################################################
exports.processjob = function(req) {
	queue.newJob(req.data);
}

//##############################################################################################
// Pi joins server and server pushes to client
//##############################################################################################
exports.pijoin = function(req) {
	redisClient.get('lastpiid', function(err, reply) {
		var piid;
		if (reply == null) {
			piid = 1;
		} else {
			piid = parseInt(reply)+1;
		}
		redisClient.set('lastpiid', piid, function (err, reply) {});
		redisClient.hset('pis', piid, req.data, function(err, reply2) {
			console.log('Pi ' + piid + ': ' + req.data + ' connected');
		});
		req.io.join('piid' + piid); // Join piid room
		app.io.room('piid' + piid).broadcast('setpiid', piid);
		app.io.room('piwatch').broadcast('pijoin', {piid: piid, piname: req.data}); // Tell clients to add pi
	});
}

//##############################################################################################
// Pi disconnects or client calls disconnect; server pushes to pi and client
//##############################################################################################
exports.pihalt = function(req) {
	redisClient.hdel('pis', req.data, function(err, reply) {
		console.log('Pi ' + req.data + ' left');
	});
	app.io.room('piid' + req.data).broadcast('pihalt'); // Tell pi to shutdown
	req.io.leave('piid' + req.data);
	app.io.room('piwatch').broadcast('pileave', req.data); // Tell clients to delete pi
}