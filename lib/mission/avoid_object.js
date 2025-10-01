var avoid_object = function (rover) {

	//is zone 12 and 11 green?

	if (!rover.zones[10].light == "green" || !rover.zones[11].light == "green") {

		//is there a green light zone facing  the next waypoint?

		for (var i = 0; i < rover.mission.waypoints.length; i++) {
			if (rover.mission.waypoints[i].seq == current_mission_seq) {
				waypoint.latitude = rover.mission.waypoints[i].lat;
				waypoint.longitude = rover.mission.waypoints[i].lng;
			}
		}

		var waypoint_bearing = rover.get_bearing(rover.robot_data.robot_latitude, rover.robot_data.robot_longitude, waypoint.latitude, waypoint.longitude);


		var rover_heading = rover.robot_data.VFR_HUD.heading || 0;
		// Calculate yaw needed to point toward the next waypoint
		var yaw_to_waypoint = (waypoint_bearing - rover_heading + 360) % 360;
		// If yaw > 180, it's shorter to turn left
		if (yaw_to_waypoint > 180) yaw_to_waypoint -= 360;
		// yaw_to_waypoint is now the signed degrees to turn (positive: right, negative: left)
		rover.robot_data.yaw_to_waypoint = yaw_to_waypoint;
		console.log('Degrees to yaw toward next waypoint:', yaw_to_waypoint);


		//is there a green light zone facing  the next waypoint?
		var path_clear = false;
		for (var i = 0; i < rover.zones.length; i++) {
			if (rover.zones[i].min_angle > rover.robot_data.yaw_to_waypoint && rover.zones[i].max_angle < rover.robot_data.yaw_to_waypoint && rover.zones[i].light == "green") {
				console.log("Zone", rover.zones[i].zone, "is green and facing waypoint. Yawing to waypoint.");
				//yaw to waypoint
				path_clear = true;
				break;
			}
		}

		if (path_clear) {
			rover.guided_mode_command(rover, 0, 0, 0, yaw_to_waypoint);
			
		} else {
			rover.guided_mode_command(rover, 0, 0, 0, 0);
		}

		//Move forward 1 meter

		//what is the angle of the next waypoint?

		//is there a green light zone facing  the next waypoint?

	}
	else {
		//resume mission......
	}

}



module.exports = avoid_object;