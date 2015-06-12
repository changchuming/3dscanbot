/*
 * GET the result of a schedule.
 */

//----------------------------------------------------------------------------------------------
// Module dependencies
//----------------------------------------------------------------------------------------------
var app = require('../app');

//##############################################################################################
//Display results of a reconstruction
//##############################################################################################
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

//Joins a room
app.io.route('join', function(req) {
    req.io.join(req.data);
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