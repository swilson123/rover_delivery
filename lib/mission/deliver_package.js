var deliver_package = function (rover, trigger) {

	console.log('deliver_package: Yaw Rover');
	
	//yaw robot 180 degrees................................
	var data = {
		param1: 180,
		param2: 30,
		param3: 1,
		param4: 1,
		param5: 0,
		param6: 0,
		param7: 0
	};

	var mav_response = rover.mavlink_messages.MAV_CMD_CONDITION_YAW(rover, data);
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