var avoid_object = function (rover) {

	// Helper: Find nearest green zone to a given yaw angle
	function find_nearest_green_zone(zones, yaw_angle) {
		let min_diff = 360;
		let best_zone = null;
		for (let i = 0; i < zones.length; i++) {
			if (zones[i].light === "green") {
				// Find center of zone
				let center = (zones[i].min_angle + zones[i].max_angle) / 2;
				let diff = Math.abs(((yaw_angle - center + 540) % 360) - 180); // shortest angle diff
				if (diff < min_diff) {
					min_diff = diff;
					best_zone = zones[i];
				}
			}
		}
		return best_zone;
	}

	if (rover.flight_data.robot_flight_mode != 'Manual') {

		let green_zone_found = find_nearest_green_zone(rover.zones, 0);

		if (green_zone_found && rover.flight_data.mav_state == 'MAV_STATE_ACTIVE' && rover.mission.mission_count > 0 && rover.flight_data.robot_flight_mode != "SMART_RTL") {


			//is zone 12 and 11 green?
			if (rover.zones[10].light !== "green" || rover.zones[11].light !== "green") {
				//object has been detected in path.......
				rover.mission.path_clear = false;
				//Set flight mode to guided..............
				rover.set_flight_mode(rover, 'Guided');

			}

			//Path is not clear look for alternative route
			if (!rover.mission.path_clear) {

				// Find next waypoint
				let waypoint = { latitude: null, longitude: null };
				for (let i = 0; i < rover.mission.waypoints.length; i++) {
					if (rover.mission.waypoints[i].seq == rover.mission.current_mission_seq) {
						waypoint.latitude = rover.mission.waypoints[i].lat;
						waypoint.longitude = rover.mission.waypoints[i].lng;
					}
				}
				// Calculate bearing and yaw
				let waypoint_bearing = rover.get_bearing(rover.robot_data.robot_latitude, rover.robot_data.robot_longitude, waypoint.latitude, waypoint.longitude);
				let rover_heading = rover.robot_data.VFR_HUD.heading || 0;
				let yaw_to_waypoint = (waypoint_bearing - rover_heading + 360) % 360;
				if (yaw_to_waypoint > 180) yaw_to_waypoint -= 360;
				rover.robot_data.yaw_to_waypoint = yaw_to_waypoint;
				console.log('rover_heading:', rover_heading + " yaw_to_waypoint: " + yaw_to_waypoint + " waypoint_bearing: " + waypoint_bearing);


				//is there a green zone facing the waypoint? (use waypoint_bearing)
				for (var i = 0; i < rover.zones.length; i++) {
					if (rover.zones[i].light == "green") {
						let zone_center = (rover.zones[i].min_angle + rover.zones[i].max_angle) / 2;
						let angle_diff = Math.abs(((yaw_to_waypoint - zone_center + 540) % 360) - 180);
						if (angle_diff < 30) { // within 30 degrees of yaw to waypoint
							console.log(`Green zone ${rover.zones[i].zone} is facing yaw to waypoint ${yaw_to_waypoint}`);
							//Resume mission if there is a green zone facing the waypoint
							rover.mission.path_clear = true;
							console.log('Path to waypoint is clear, resuming mission.');
							rover.set_flight_mode(rover, 'Auto');
							return; // exit function after commanding forward
						}
					}
				}

				// No green zone directly facing waypoint
				if (!rover.mission.path_clear) {
					if (rover.zones[10].light !== "green" || rover.zones[11].light !== "green") {
						// If path ahead is blocked, find nearest green zone to waypoint bearing
						let nearest_green = find_nearest_green_zone(rover.zones, waypoint_bearing);
						if (nearest_green) {
							let green_center = (nearest_green.min_angle + nearest_green.max_angle) / 2;
							let yaw_to_green = (green_center - rover_heading + 360) % 360;
							if (yaw_to_green > 180) yaw_to_green -= 360;
							console.log(`Yawing to nearest green zone: Zone ${nearest_green.zone}, center angle ${green_center}, yaw ${yaw_to_green}`);
							rover.guided_mode_command(rover, 0.5, 0, 0, yaw_to_green);
						} else {
							console.log('No green zone available, holding position.');
						}
					}
					else {
						//command rover to move forward
						console.log('Path ahead is clear, moving forward. .5 meter');
						rover.guided_mode_command(rover, .5, 0, 0, 0);
					}
				}

			}

		}
	}

}

module.exports = avoid_object;