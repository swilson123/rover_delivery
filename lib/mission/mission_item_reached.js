//sends message to radio and websocket........................
var mission_item_reached = function (rover, message) {
	console.log('MISSION_ITEM_REACHED - ', message);
	rover.mission.current_mission_seq = message.seq;

	var data = {
		seq: rover.mission.current_mission_seq,
	};

	var mav_response = rover.mavlink_messages.MISSION_REQUEST(rover, data);

	rover.send_pixhawk_command(rover, mav_response[0], mav_response[1], null);

	if (rover.mission.mission_count == rover.mission.current_mission_seq + 1) {
		//Change Flight Mode to: Guided........
		rover.flight_mode_trigger = 'mission_finished';
		rover.set_flight_mode(rover, 'Guided');
	}

};


module.exports = mission_item_reached;