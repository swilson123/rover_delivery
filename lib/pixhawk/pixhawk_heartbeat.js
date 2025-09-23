//sends message to radio and websocket........................
var pixhawk_heartbeat = function(rover)
	{



		if (rover.pixhawk_port.heartbeat_count == 1)
		{
            rover.request_data_stream(rover);
			rover.pixhawk_port.connected = true;
			rover.disarm_robot(rover, null);

			var notification = {
				notification_type: 'Pixhawk',
				notification_title: 'Pixhawk Connected',
				notification_text: 'Pixhawk Port is open'
			};

			rover.send_notification(rover, notification);


			rover.logs.server.log(rover, "Pixhawk Port is open");
			console.log("Pixhawk Port is open");
		}

		rover.pixhawk_port.heartbeat_count = rover.pixhawk_port.heartbeat_count + 1;


		clearTimeout(rover.pixhawk_port.heartbeat);

		rover.pixhawk_port.heartbeat = setTimeout(function()
		{
			rover.pixhawk_port.heartbeat_count = 0;
			rover.pixhawk_port.connected = false;
			rover.logs.server.log(rover, "No Heartbeat!!!!!!!!!!!!");

			var notification = {
				notification_type: 'Pixhawk',
				notification_title: 'No Heartbeat',
				notification_text: 'Not communicating with pixhawk'
			};

			rover.send_notification(rover, notification);

			if (rover.pixhawk_port.serial)
			{
				rover.pixhawk_port.serial.close();
			}

		}, 8000);

	};


module.exports = pixhawk_heartbeat;