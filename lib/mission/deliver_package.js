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

		if (rover.delivery_device == 'dump_trailer') {
			//Open Servo..................
			var data = {
				param1: 9,
				param2: 1500,
				param3: 0,
				param4: 0,
				param5: 0,
				param6: 0,
				param7: 0
			};

			var mav_response = rover.mavlink_messages.MAV_CMD_DO_SET_SERVO(rover, data);
			rover.send_pixhawk_command(rover, mav_response[0], mav_response[1], null);


			setTimeout(function () {
				//Close Servo..................
				var data = {
					param1: 9,
					param2: 1050,
					param3: 0,
					param4: 0,
					param5: 0,
					param6: 0,
					param7: 0
				};

				var mav_response = rover.mavlink_messages.MAV_CMD_DO_SET_SERVO(rover, data);
				rover.send_pixhawk_command(rover, mav_response[0], mav_response[1], null);


				//Recall Rover: Smart RTL........
				rover.set_flight_mode(rover, 'SMART_RTL');

			}, 5000);
		}
		else if (rover.delivery_device == 'lever_arm_hook') {

		}
		else if (rover.delivery_device == 'crain') {

		}

	}, 5000);
};


module.exports = deliver_package;