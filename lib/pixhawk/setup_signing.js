var setup_signing = function(rover)
	{

console.log('setup signing!');
//MAV_CMD_REQUEST_PROTOCOL_VERSION................
		var data = {
			status_text: 'MAV_CMD_REQUEST_PROTOCOL_VERSION',
			command: rover.mavlink.MAV_CMD_REQUEST_PROTOCOL_VERSION,
			confirmation: 1,
			param1: 1,
			param2: 0,
			param3: 0,
			param4: 0,
			param5: 0,
			param6: 0,
			param6: 0
		};

		var mav_response = rover.mavlink_messages.COMMAND_LONG(rover, data);
		rover.send_pixhawk_command(rover, mav_response[0], mav_response[1], null);


/*
		//The timestamp is a 48 bit number with units of 10 microseconds since 1st January 2015 GMT. For systems where the time since 1/1/1970 is available (the unix epoch) you can use an offset in seconds of 1420070400.
		var initial_timestamp = Date.now() - 1420070400;
		var secret_key = 'yBRkQzQwh7';

		var request = new rover.mavlink.messages.setup_signing(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, secret_key, initial_timestamp);

		rover.send_pixhawk_command(rover, 'setup_signing request', request, null);
*/


	};


module.exports = setup_signing;