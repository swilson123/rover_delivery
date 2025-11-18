var move_rover = function (rover, motor_id, motor_speed_cmd) {
	if (rover.waveshare.connected) {
		 var message = { "T": 10010, "id": motor_id, "cmd": motor_speed_cmd, "act": 3 };
     rover.create_waveshare_message(rover, message);
	} else {
		console.log('Waveshare not connected');
	}
};


module.exports = move_rover;