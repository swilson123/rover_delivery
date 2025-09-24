var reset_rover = function (rover) {

	console.log('reset_rover: Resetting Rover Params!');

	rover.mission.mission_count = 0;
	rover.mission.waypoints = [];
	rover.flight_mode_trigger = null;
	rover.mission.package_delivered = null;

};


module.exports = reset_rover;