/*
 * GET the result of a schedule.
 */

//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');
var pyfunc = require('../modules/pyfunc');

//##############################################################################################
//Display results of a reconstruction
//##############################################################################################
exports.display = function(req, res){
	console.log('script run');
	
	// commenting out the main index page
  	res.render('result', {
	  	title: req.params.job
  	});
	
	pyfunc.reconstruct(req.params.job);
};
/*
exports.display = function(req, res){
	// Get schedule
	redisClient.hgetall('schedule:'+req.params.schedule, function(err, reply){
		// If schedule invalid
		if (reply == null) {
			res.render('error', {
				error: 'Link not found'
			});
		}
		// Else display results
		else {
            console.log(reply);
            res.render('result', { 
                title: '3Dify', 
                //result: req.params.result,  
                data: JSON.stringify(reply)
            });
        }
	});
};
*/

//Joins a room
app.io.route('join', function(req) {
	console.log(req.data);
    req.io.join(req.data);
    app.io.room(req.data).broadcast('something', 'something');
})

// Leaves a room
app.io.route('leave', function(req) {
    req.io.leave(req.data);
})


// broadcasts to a room
var broadcastResult = function(result) {
    // Get something then broadcasts it
	//app.io.room(result).broadcast('something', data);
}