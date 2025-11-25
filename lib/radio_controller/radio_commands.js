var radio_commands = function (rover, message) {
	//throttle command.....................
	if (message.chan11_raw > 1500) {
		rover.robot_data.mission_mode = true;
		rover.run_mission(rover);

	}
	else {
		rover.robot_data.mission_mode = false;
	}

	if (!rover.robot_data.mission_mode) {
		var throttle = message.chan3_raw;
		var yaw = message.chan1_raw;
		var motor_speed_cmd = 0;

	

		if (throttle > 1900) {
			motor_speed_cmd = 200;

		} else if (throttle > 1850) {
			motor_speed_cmd = 175;
		}
		else if (throttle > 1800) {
			motor_speed_cmd = 150;
		}
		else if (throttle > 1750) {
			motor_speed_cmd = 125;
		}
		else if (throttle > 1700) {
			motor_speed_cmd = 100;
		}
		else if (throttle > 1650) {
			motor_speed_cmd = 75;
		}
		else if (throttle > 1600) {
			motor_speed_cmd = 50;
		}
		else if (throttle > 1550) {
			motor_speed_cmd = 25;
		}
		else if (throttle > 1450) {
			motor_speed_cmd = 0;
		}
		else if (throttle > 1400) {
			motor_speed_cmd = -25;
		}
		else if (throttle > 1350) {
			motor_speed_cmd = -50;
		}
		else if (throttle > 1300) {
			motor_speed_cmd = -75;
		}
		else if (throttle > 1250) {
			motor_speed_cmd = -100;
		}
		else if (throttle > 1200) {
			motor_speed_cmd = -125;
		}
		else if (throttle > 1150) {
			motor_speed_cmd = -150;
		}
		else if (throttle > 1100) {
			motor_speed_cmd = -175;
		}
		else {
			motor_speed_cmd = -200;
		}

		setTimeout(() => {
			//front passenger
			if (message.chan1_raw > 1450 && message.chan1_raw < 1550 || message.chan1_raw > 1900 || message.chan1_raw < 1100) {
				rover.move_rover(rover, 1, motor_speed_cmd * -1);

			} else {
				rover.move_rover(rover, 1, motor_speed_cmd);
			}

		}, 10);

		setTimeout(() => {
			rover.move_rover(rover, 2, motor_speed_cmd);
		}, 20);
		setTimeout(() => {
			//front driver side
			if (message.chan1_raw > 1900 || message.chan1_raw < 1100) {
				rover.move_rover(rover, 3, motor_speed_cmd * -1);
			} else {
				rover.move_rover(rover, 3, motor_speed_cmd);
			}

		}, 30);
		setTimeout(() => {
			//rear driver side
			if (message.chan1_raw > 1450 && message.chan1_raw < 1550) {
				rover.move_rover(rover, 4, motor_speed_cmd * -1);
			} else {
				rover.move_rover(rover, 4, motor_speed_cmd);
			}


		}, 40);

	}

};


module.exports = radio_commands;