/*
 * Pi routes
 */

//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var pyfunc = require('../modules/pyfunc');

exports.callback = function(req) {
    req.io.join(req.data);
	// Broadcast current job
	if (req.data == 'piwatch') {
  		app.io.room('piwatch').broadcast('snap', 'snap');
	  	console.log('Pi connected.')
	}
}