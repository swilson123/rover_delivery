var reset_rover = function (rover) {

	console.log('reset_rover: Resetting Rover Params!');

	rover.mission.mission_count = 0;
	rover.mission.waypoints = [];

};


module.exports = reset_rover;