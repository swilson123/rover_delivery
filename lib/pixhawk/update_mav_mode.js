//sends message to radio and websocket........................
var update_mav_mode = function(rover, mav_mode)
	{

		if (rover.MavStates[mav_mode] != 'MAV_STATE_UNINIT')
		{
			rover.flight_data.mav_state = rover.MavStates[mav_mode];


			rover.logs.update_mav_mode.log(rover, 'Mav State - ' + rover.flight_data.mav_state);
			console.log('Mav State - ' + rover.flight_data.mav_state);



			//Mav State............................................................
			if (rover.flight_data.mav_state == 'MAV_STATE_ACTIVE')
			{
				//Drone is ready to fly....................................
				rover.flight_data.inflight = true;
				rover.flight_data.control_type = 1;


				rover.stream_video(rover);


			}
			else if (rover.flight_data.mav_state == 'MAV_STATE_CRITICAL')
			{
				rover.stream_video(rover);


				//Send.......................
				var notification = {
					notification_type: 'MAV_STATE',
					notification_title: rover.flight_data.mav_state,
					notification_text: 'MAV State Changed!'
				};


				rover.send_notification(rover, notification);

				rover.recall_robot(rover);


			}
			else if (rover.flight_data.mav_state == 'MAV_STATE_EMERGENCY')
			{
				rover.stream_video(rover);


				//Send.......................
				var notification = {
					notification_type: 'MAV_STATE',
					notification_title: rover.flight_data.mav_state,
					notification_text: 'MAV State Changed!'
				};


				rover.send_notification(rover, notification);

				rover.recall_robot(rover);



			}
			else if (rover.flight_data.mav_state == 'MAV_STATE_BOOT')
			{

				rover.disarm_robot(rover, null);


			}
			else if (rover.flight_data.mav_state == 'MAV_STATE_CALIBRATING')
			{


				rover.disarm_robot(rover, null);

			}
			else if (rover.flight_data.mav_state == 'MAV_STATE_POWEROFF')
			{

				rover.disarm_robot(rover, null);


			}
			else if (rover.flight_data.mav_state == 'MAV_STATE_FLIGHT_TERMINATION')
			{

				rover.disarm_robot(rover, null);


			}
			else if (rover.flight_data.mav_state == 'MAV_STATE_STANDBY')
			{

				rover.disarm_robot(rover, null);

			}
			else
			{
				console.log('Unknown Mav State: ' + rover.flight_data.mav_state);
			}

		}

	};


module.exports = update_mav_mode;