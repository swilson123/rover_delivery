var guided_mode_command = function(rover, x, y, z, yaw)
	{

		//x: - Pitch back, + Pitch Forward.
		//y: -Roll left, +Roll Right
		//z: +Desc, -Asc
		//Send Guided Command before
		if (yaw)
		{

			//North is 0 or 360 degrees
			var yaw_degrees = rover.robot_data.VFR_HUD.heading + yaw;


			if (yaw_degrees > 360)
			{
				yaw_degrees = yaw_degrees - 360;
			}
			else if (yaw < 0)
			{
				yaw_degrees = 360 + yaw;
			}




			yaw = (yaw_degrees) * Math.PI / 180;
		}




		var data = {
			time_usec: Date.now(),
			frame: rover.guided_mode_command_robot.mav_frame,
			type_mask: rover.guided_mode_command_robot.type_mask,
			x: x,
			y: y,
			z: z,
			vx: null,
			vy: null,
			vz: null,
			afx: null,
			afy: null,
			afz: null,
			yaw: yaw,
			yaw_rate: rover.guided_mode_command_robot.yaw_rate
		}

		var mav_response = rover.mavlink_messages.SET_POSITION_TARGET_LOCAL_NED(rover, data);

		rover.send_pixhawk_command(rover, mav_response[0], mav_response[1], null);

		setTimeout(function()
		{


			rover.set_flight_mode(rover, 'Guided');

		}, 1000);




	};


module.exports = guided_mode_command;