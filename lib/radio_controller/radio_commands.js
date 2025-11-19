var radio_commands = function (rover, message) {
	//throttle command.....................

	var throttle = message.chan3_raw;
	var motor_speed_cmd = 0;


	if (throttle < 1900) {
		motor_speed_cmd = 200;

	} else if (throttle > 1800) {
		motor_speed_cmd = 175;
	}
	else if (throttle > 1700) {
		motor_speed_cmd = 150;
	}
	else if (throttle > 1600) {
		motor_speed_cmd = 125;
	}
	else if (throttle > 1500) {
		motor_speed_cmd = 100;
	}
	else if (throttle > 1400) {
		motor_speed_cmd = 80;
	}
	else if (throttle > 1300) {
		motor_speed_cmd = 60;
	}
	else if (throttle > 1200) {
		motor_speed_cmd = 40;
	}
	else if (throttle > 1100) {
		motor_speed_cmd = 20;
	}

	rover.move_rover(rover, 1, motor_speed_cmd);
	rover.move_rover(rover, 2, motor_speed_cmd);
	rover.move_rover(rover, 3, motor_speed_cmd);
	rover.move_rover(rover, 4, motor_speed_cmd);

};


module.exports = radio_commands;