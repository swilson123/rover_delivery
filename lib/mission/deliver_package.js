var deliver_package = function (rover, trigger) {

	console.log('deliver_package: Yaw Rover');

	//yaw robot 180 degrees................................
	var data = {
		frame: 1,
		type_mask: 0b0000111111111000,
		x: 0,
		y: 0,
		z: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		afx: 0,
		afy: 0,
		afz: 0,
		yaw: 180 * Math.PI / 180, // Convert degrees to radians
		yaw_rate: 0
	};

	var mav_response = rover.mavlink_messages.SET_POSITION_TARGET_LOCAL_NED(rover, data);
	rover.send_pixhawk_command(rover, mav_response[0], mav_response[1], null);


	//Yaw Completed..............
	setTimeout(function () {

		console.log('deliver_package: ' + rover.delivery_device);
		rover.mission.package_delivered = true;

		if (rover.delivery_device == 'dump_trailer') {
			rover.deliver_package_dump_trailer(rover);

		} else if (rover.delivery_device == 'arm_delivery') {
			rover.deliver_package_arm(rover);
		}

		setTimeout(function () {

			//Recall Rover: Smart RTL........
			rover.set_flight_mode(rover, 'SMART_RTL');

		}, 10000);

	}, 5000);
};


module.exports = deliver_package;