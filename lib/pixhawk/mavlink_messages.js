var mavlink_messages = function()
	{

		};


// GPS_RTCM_DATA................................................................................................

mavlink_messages.prototype.GPS_RTCM_DATA = function(rover, flags, length, data)
{
/*
RTCM message for injecting into the onboard GPS (used for DGPS)

Field Name	Type	Units	Description
flags	uint8_t		LSB: 1 means message is fragmented, next 2 bits are the fragment ID, the remaining 5 bits are used for the sequence ID. Messages are only to be flushed to the GPS when the entire message has been reconstructed on the autopilot. The fragment ID specifies which order the fragments should be assembled into a buffer, while the sequence ID is used to detect a mismatch between different buffers. The buffer is considered fully reconstructed when either all 4 fragments are present, or all the fragments before the first fragment with a non full payload is received. This management is used to ensure that normal GPS operation doesn't corrupt RTCM data, and to recover from a unreliable transport delivery order.
len	uint8_t	bytes	data length
data	uint8_t[180]		RTCM message (may be fragmented)
*/

    var request = new rover.mavlink.messages.gps_rtcm_data(flags, length, data);

	var status_message = 'gps_rtcm_data command';

	return [status_message, request];



};

// GPS_INJECT_DATA................................................................................................

mavlink_messages.prototype.GPS_INJECT_DATA = function(rover, length, data)
{
/*
GPS_INJECT_DATA ( #123 )
Data for injecting into the onboard GPS (used for DGPS)

Field Name	Type	Units	Description
target_system	uint8_t		System ID
target_component	uint8_t		Component ID
len	uint8_t	bytes	Data length
data	uint8_t[110]		Raw data (110 is enough for 12 satellites of RTCMv2)
*/

    var request = new rover.mavlink.messages.gps_inject_data(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, length, data);

	var status_message = 'GPS_INJECT_DATA command';

	return [status_message, request];



};

// MAV_CMD_DO_SET_SERVO................................................................................................

mavlink_messages.prototype.MAV_CMD_DO_SET_SERVO = function(rover, data)
{
/*
MAV_CMD_DO_SET_SERVO (183 )
Set a servo to a desired PWM value.

Param	Description	Values	Units
1	Servo instance number.
GCS display settings: Label:Instance,	min:0 increment:1
2	Pulse Width Modulation.
GCS display settings: Label:PWM,	min:0 increment:1	us
3	Empty
4	Empty
5	Empty
6	Empty
7	Empty
*/

	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_DO_SET_SERVO, 1, data.param1, data.param2, 0, 0, 0, 0, 0);

	var status_message = 'MAV_CMD_DO_SET_SERVO command';

	return [status_message, request];



};

// MAV_CMD_DO_SET_RELAY................................................................................................

mavlink_messages.prototype.MAV_CMD_DO_SET_RELAY = function(rover, data)
{
/*
MAV_CMD_DO_SET_RELAY (181 )
Set a relay to a condition.

Param	Description
1	Relay number
2	Setting (1=on, 0=off, others possible depending on system hardware)
3	Empty
4	Empty
5	Empty
6	Empty
7	Empty
*/

	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_DO_SET_RELAY, 1, data.param1, data.param2, 0, data.param4, data.param5, data.param6, data.param7);

	var status_message = 'MAV_CMD_DO_SET_RELAY command';

	return [status_message, request];



};


// Mission COUNT................................................................................................

mavlink_messages.prototype.MISSION_COUNT = function(rover, data)
{


	var request = new rover.mavlink.messages.mission_count(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, data.count);

	var status_message = 'Mission Count: Command Sent';

	return [status_message, request];



};

mavlink_messages.prototype.MISSION_WRITE_PARTIAL_LIST = function(rover, data)
{

	var request = new rover.mavlink.messages.mission_write_partial_list(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, data.start_index, data.end_index);

	var status_message = 'MISSION_WRITE_PARTIAL_LIST: Command Sent';

	return [status_message, request];


};





// Mission COUNT................................................................................................

mavlink_messages.prototype.MISSION_SET_CURRENT = function(rover, data)
{


	var request = new rover.mavlink.messages.mission_set_current(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, data.seq);

	var status_message = 'MISSION_SET_CURRENT: Command Sent';

	return [status_message, request];



};



// Mission Request................................................................................................

mavlink_messages.prototype.MISSION_REQUEST_LIST = function(rover)
{


	var request = new rover.mavlink.messages.mission_request_list(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent);

	var status_message = 'MISSION_REQUEST_LIST Command Sent: ';

	return [status_message, request];



};

// Mission Request................................................................................................

mavlink_messages.prototype.MISSION_REQUEST = function(rover, data)
{


	var request = new rover.mavlink.messages.mission_request(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, data.seq);

	var status_message = 'MISSION_REQUEST Command Sent: ';

	return [status_message, request];



};

// Mission Item................................................................................................

mavlink_messages.prototype.MISSION_ITEM = function(rover, data)
{


	var request = new rover.mavlink.messages.mission_item(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, data.seq, data.frame, data.command, data.current, data.autocontinue, data.param1, data.param2, data.param3, data.param4, data.param5, data.param6, data.param7);

	var status_message = 'mission_item: ' + data.command;

	return [status_message, request];



};



// SET_POSITION_TARGET_LOCAL_NED................................................................................................

mavlink_messages.prototype.REQUEST_DATA_STREAM = function(rover, data)
{


	var request = new rover.mavlink.messages.request_data_stream(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, data.req_stream_id, data.req_message_rate, data.start_stop);

	var status_message = 'REQUEST_DATA_STREAM: (Req_stream_id =' + data.req_stream_id + ') (req_message_rate =' + data.req_message_rate + ') (start_stop = ' + data.start_stop + ')';

	return [status_message, request];



};

// SET_POSITION_TARGET_LOCAL_NED................................................................................................

mavlink_messages.prototype.SET_POSITION_TARGET_LOCAL_NED = function(rover, data)
{

	//http://ardupilot.org/dev/docs/copter-commands-in-guided-mode.html
/*
Command Field	Description
time_boot_ms	Sender's system time in milliseconds since boot
target_system	System ID of vehicle
target_component	Component ID of flight controller or just 0
coordinate_frame	Valid options are listed below
type_mask
Bitmask to indicate which fields should be ignored by the vehicle (see POSITION_TARGET_TYPEMASK enum)

bit1:PosX, bit2:PosY, bit3:PosZ, bit4:VelX, bit5:VelY, bit6:VelZ, bit7:AccX, bit8:AccY, bit9:AccZ, bit11:yaw, bit12:yaw rate

When providing Pos or Vel all 3 axis must be provided

Use Position : 0b110111111000 / 0x0DF8 / 3576 (decimal)
Use Velocity : 0b110111000111 / 0x0DC7 / 3527 (decimal)
Use Pos+Vel : 0b110111000000 / 0x0DC0 / 3520 (decimal)
Acceleration not supported

x	X Position in meters (positive is forward or North)
y	Y Position in meters (positive is right or East)
z	Z Position in meters (positive is down)
vx	X velocity in m/s (positive is forward or North)
vy	Y velocity in m/s (positive is right or East)
vz	Z velocity in m/s (positive is down)
afx	X acceleration not supported
afy	Y acceleration not supported
afz	Z acceleration not supported
yaw	yaw or heading in radians (0 is forward or North)
yaw_rate	yaw rate in rad/s

*/

	var request = new rover.mavlink.messages.set_position_target_local_ned(data.time_usec, rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, data.frame, data.type_mask, data.x, data.y, data.z, data.vx, data.vy, data.vz, data.afx, data.afy, data.afz, data.yaw, data.yaw_rate);


	var status_message = 'set_position_target_local_ned request command sent';

	return [status_message, request];

};



// SET_POSITION_TARGET_GLOBAL_INT................................................................................................

mavlink_messages.prototype.SET_POSITION_TARGET_GLOBAL_INT = function(rover, data)
{

/*
Command parameters

Command Field	Description
time_boot_ms	Sender's system time in milliseconds since boot
target_system	System ID of vehicle
target_component	Component ID of flight controller or just 0
coordinate_frame
Valid options are:

MAV_FRAME_GLOBAL_INT : alt is meters above sea level
MAV_FRAME_GLOBAL_RELATIVE_ALT: alt is meters above home
MAV_FRAME_GLOBAL_RELATIVE_ALT_INT: alt is meters above home
MAV_FRAME_GLOBAL_RELATIVE_TERRAIN_ALT: alt is meters above terrain
MAV_FRAME_GLOBAL_RELATIVE_TERRAIN_ALT_INT: alt is meters above terrain
type_mask
Bitmask to indicate which fields should be ignored by the vehicle (see POSITION_TARGET_TYPEMASK enum)

bit1:PosX, bit2:PosY, bit3:PosZ, bit4:VelX, bit5:VelY, bit6:VelZ, bit7:AccX, bit8:AccY, bit9:AccZ, bit11:yaw, bit12:yaw rate

When providing Pos or Vel all 3 axis must be provided

Use Position : 0b110111111000 / 0x0DF8 / 3576 (decimal)
Use Velocity : 0b110111000111 / 0x0DC7 / 3527 (decimal)
Use Pos+Vel : 0b110111000000 / 0x0DC0 / 3520 (decimal)
Acceleration not supported

lat_int	Latitude * 1e7
lon_int	Longitude * 1e7
alt	Alt in meters above sea level, home or terrain (see coordinate_frame field)
vx	X velocity in m/s (positive is North)
vy	Y velocity in m/s (positive is East)
vz	Z velocity in m/s (positive is down)
afx	X acceleration not supported
afy	Y acceleration not supported
afz	Z acceleration not supported
yaw	yaw or heading in radians (0 is forward or North)
yaw_rate	yaw rate in rad/s
*/

	var request = new rover.mavlink.messages.set_position_target_global_int(data.time_usec, rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, data.frame, data.type_mask, data.lat_int, data.lon_int, data.alt, data.vx, data.vy, data.vz, data.afx, data.afy, data.afz, data.yaw, data.yaw_rate);


	var status_message = 'set_position_target_local_ned request command sent';

	return [status_message, request];

};



mavlink_messages.prototype.SET_ATTITUDE_TARGET = function(rover, data)
{



/*
Sets a desired vehicle attitude. Used by an external controller to
command the vehicle (manual controller or other system).

                time_boot_ms              : Timestamp in milliseconds since system boot (uint32_t)
                target_system             : System ID (uint8_t)
                target_component          : Component ID (uint8_t)
                type_mask                 : Mappings: If any of these bits are set, the corresponding input should be ignored: bit 1: body roll rate, bit 2: body pitch rate, bit 3: body yaw rate. bit 4-bit 6: reserved, bit 7: throttle, bit 8: attitude (uint8_t)
                q                         : Attitude quaternion (w, x, y, z order, zero-rotation is 1, 0, 0, 0) (float)
                body_roll_rate            : Body roll rate in radians per second (float)
                body_pitch_rate           : Body pitch rate in radians per second (float)
                body_yaw_rate             : Body yaw rate in radians per second (float)
                thrust                    : Collective thrust, normalized to 0 .. 1 (-1 .. 1 for vehicles capable of reverse trust) (float)

*/
	// # Thrust >  0.5: Ascend
	//    # Thrust == 0.5: Hold the altitude
	//    # Thrust <  0.5: Descend

	//       0b00000000, # Type mask: bit 1 is LSB
	//       to_quaternion(roll_angle, pitch_angle), # Quaternion
	//       0b00000000 if use_yaw_rate else 0b00000100,
	//       to_quaternion(roll_angle, pitch_angle, yaw_angle), # Quaternion

	var request = new rover.mavlink.messages.set_attitude_target(Date.now(), rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, '0b00000000', data.quaternion, data.body_roll_rate, data.body_pitch_rate, data.body_yaw_rate, data.thrust);

	var status_message = 'set_attitude_target command sent';

	return [status_message, request];


};







/*
#========================================================================================================================================== #
..................................................................Command Long.........................................................
#========================================================================================================================================== #
*/



mavlink_messages.prototype.MAV_CMD_MISSION_START = function(rover)
{

/*
MAV_CMD_MISSION_START The first mission item to run.
Mission Param #1  Empty
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Empty
Mission Param #6  Empty
Mission Param #7  Empty
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_MISSION_START, 1, 0, 0, 0, 0, 0, 0, 0);

	var status_message = 'MAV_CMD_MISSION_START command';

	return [status_message, request];
};


mavlink_messages.prototype.MAV_CMD_DO_CHANGE_SPEED = function(rover, data)
{

/*
1	Speed type (0=Airspeed, 1=Ground Speed, 2=Climb Speed, 3=Descent Speed)
2	Speed (m/s, -1 indicates no change)
3	Throttle ( Percent, -1 indicates no change)
4	absolute or relative [0,1]
5	Empty
6	Empty
7	Empty
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 1, data.param1, 0, 0, 0, 0, 0, 0);

	var status_message = 'Drone change speed cmd sent';

	return [status_message, request];

};




mavlink_messages.prototype.MAV_CMD_COMPONENT_ARM_DISARM = function(rover, data)
{

/*
400 MAV_CMD_COMPONENT_ARM_DISARM  Arms / Disarms a component
Mission Param #1  1 to arm, 0 to disarm
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 1, data.param1, 0, 0, 0, 0, 0, 0);

	var status_message = 'Drone Arm Command!';

	return [status_message, request];

};



mavlink_messages.prototype.MAV_CMD_NAV_WAYPOINT = function(rover, data)
{

/*
MAV_CMD_NAV_WAYPOINT  Navigate to the specified position.
Mission Param #1  Hold time at mission waypoint in decimal seconds - MAX 65535 seconds. (Copter/Rover only)
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Latitude
Mission Param #6  Longitude
Mission Param #7  Altitude (ground level) meters
*/
	var request = null;
	var status_message = null;

	if (data.param5 && data.param6)
	{


		request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_NAV_WAYPOINT, 1, data.param1, 0, 0, 0, parseInt(data.param5 * 10000000), parseInt(data.param6 * 10000000), data.param7);

		status_message = 'NAV_WAYPOINT (Lat: ' + data.param5 + ' Lon: ' + data.param6 + ' Alt: ' + data.param7 + ')';

	}
	else
	{
		status_message = 'NAV_WAYPOINT missing target lat and lon';
	}

	return [status_message, request];


};



mavlink_messages.prototype.MAV_CMD_NAV_TAKEOFF = function(rover, data)
{

/*
MAV_CMD_NAV_TAKEOFF Takeoff from ground / hand
Mission Param #1  Empty
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Empty
Mission Param #6  Empty
Mission Param #7  Altitude
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_NAV_TAKEOFF, 1, 0, 0, 0, 0, 0, 0, data.param7);

	var status_message = 'Takeoff command sent: (Alt =' + data.param7 + ')';

	return [status_message, request];

};



mavlink_messages.prototype.MAV_CMD_NAV_LOITER_UNLIM = function(rover, data)
{

/*
Loiter at the specified location for an unlimited amount of time.
Mission Param #1  Empty
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Target latitude. If zero, the vehicle will loiter at the current latitude.
Mission Param #6  Target longitude. If zero, the vehicle will loiter at the current longitude.
Mission Param #7  Target altitude. If zero, the vehicle will loiter at the current altitude.
*/

	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_NAV_LOITER_UNLIM, 1, 0, 0, 0, 0, data.param5, data.param6, data.param7);

	var status_message = 'LOITER_UNLIM command sent';
	return [status_message, request];

};



mavlink_messages.prototype.MAV_CMD_NAV_LOITER_TURNS = function(rover, data)
{

/*
Loiter at the specified location for an unlimited amount of time.
Mission Param #1  Number of turns (N x 360°)
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Target latitude. If zero, the vehicle will loiter at the current latitude.
Mission Param #6  Target longitude. If zero, the vehicle will loiter at the current longitude.
Mission Param #7  Target altitude. If zero, the vehicle will loiter at the current altitude.
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_NAV_TAKEOFF, 1, data.param1, 0, 0, 0, data.param5, data.param6, data.param7);

	var status_message = 'LOITER_TURNS command sent';

	return [status_message, request];

};



mavlink_messages.prototype.MAV_CMD_NAV_LOITER_TIME = function(rover, data)
{

/*
Loiter at the specified location for a set time (in seconds).
Mission Param #1  Time to loiter at waypoint (seconds - decimal)
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Target latitude. If zero, the vehicle will loiter at the current latitude.
Mission Param #6  Target longitude. If zero, the vehicle will loiter at the current longitude.
Mission Param #7  Target altitude. If zero, the vehicle will loiter at the current altitude.
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_NAV_TAKEOFF, 1, data.param1, 0, 0, 0, data.param5, data.param6, data.param7);

	var status_message = 'LOITER_TIME command sent';

	return [status_message, request];

};



mavlink_messages.prototype.COMMAND_LONG = function(rover, data)
{

/*
1	The MAVLink message ID
2	The interval between two messages, in microseconds. Set to -1 to disable and 0 to request default rate.
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, data.command, data.confirmation, data.param1, data.param2, data.param3, data.param4, data.param5, data.param6, data.param7);

	var status_message = data.status_text;

	return [status_message, request];

};



mavlink_messages.prototype.MAV_CMD_NAV_GUIDED_ENABLE = function(rover, data)
{

/*
Enable GUIDED mode to hand over control to an external controller.
Mission Param #1  A value of > 0.5 enables GUIDED mode. Any value <= 0.5f turns it off.
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Empty
Mission Param #6  Empty
Mission Param #7  Empty
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_NAV_GUIDED_ENABLE, 1, data.param1, 0, 0, 0, 0, 0, 0);

	var status_message = 'MAV_CMD_NAV_GUIDED_ENABLE command sent';

	return [status_message, request];

};




mavlink_messages.prototype.MAV_CMD_NAV_LAND = function(rover, data)
{

/*
MAV_CMD_NAV_LAND  Land at location
Mission Param #1  Abort Alt - Altitude to climb to if landing is aborted
Mission Param #2  Precision land mode. (0 = normal landing, 1 = opportunistic precision landing, 2 = required precsion landing)
Mission Param #3  Empty
Mission Param #4  Desired yaw angle. NaN for unchanged.
Mission Param #5  Latitude
Mission Param #6  Longitude
Mission Param #7  Altitude (ground level)
*/
	var request = null;
	var status_message = null;
	if (data.param5 && data.param6)
	{


		request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_NAV_LAND, 1, data.param1, data.param2, 0, data.param4, data.param5, data.param6, data.param7);

		status_message = 'MAV_CMD_NAV_LAND (Lat: ' + data.param5 + ' Lon: ' + data.param6 + ' ALT: ' + data.param7 + ')';

	}
	else
	{
		var status_message = 'MAV_CMD_NAV_LAND: Missing Target lat and lon';
	}
	return [status_message, request];
};


mavlink_messages.prototype.LANDING_TARGET = function(rover, data)
{


	var request = new rover.mavlink.messages.landing_target(data.time_usec, data.target_num, data.frame, data.angle_x, data.angle_y, data.distance, data.size_x, data.size_y)
	var status_message = 'LANDING_TARGET: updated';

	return [status_message, request];
};

mavlink_messages.prototype.MAV_CMD_CONDITION_DELAY = function(rover, data)
{

/*
After reaching a waypoint, delay the execution of the next conditional “_DO_” command for the specified number of seconds (e.g. MAV_CMD_DO_SET_ROI).
Mission Param #1  Delay in seconds (decimal).
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Empty
Mission Param #6  Empty
Mission Param #7  Empty
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_CONDITION_DELAY, 1, data.param1, 0, 0, 0, 0, 0, 0);

	var status_message = 'CONDITION_DELAY command sent';

	return [status_message, request];

};


mavlink_messages.prototype.MAV_CMD_CONDITION_CHANGE_ALT = function(rover, data)
{

/*
After reaching a waypoint, delay the execution of the next conditional “_DO_” command for the specified number of seconds (e.g. MAV_CMD_DO_SET_ROI).
Mission Param #1  Descent / Ascend rate (m/s).
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Empty
Mission Param #6  Empty
Mission Param #7  Target altitude
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_CONDITION_CHANGE_ALT, 1, data.param1, 0, 0, 0, 0, 0, data.param7);

	var status_message = 'CHANGE_ALT command sent';

	return [status_message, request];

};



mavlink_messages.prototype.MAV_CMD_CONDITION_DISTANCE = function(rover, data)
{

/*
After reaching a waypoint, delay the execution of the next conditional “_DO_” command for the specified number of seconds (e.g. MAV_CMD_DO_SET_ROI).
Mission Param #1  Distance from the next waypoint before DO commands are executed (meters).
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Empty
Mission Param #6  Empty
Mission Param #7  Empty
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_CONDITION_DISTANCE, 1, data.param1, 0, 0, 0, 0, 0, 0);

	var status_message = 'CONDITION_DISTANCE command sent';

	return [status_message, request];

};


mavlink_messages.prototype.MAV_CMD_DO_CHANGE_ALTITUDE = function(rover, data)
{

/*
Change altitude set point.
Param	Description
1	Altitude in meters
2	Mav frame of new altitude (see MAV_FRAME)
3	Empty
4	Empty
5	Empty
6	Empty
7	Empty
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_DO_CHANGE_ALTITUDE, 1, data.param1, data.param2, 0, 0, 0, 0, 0);

	var status_message = 'MAV_CMD_DO_CHANGE_ALTITUDE command sent';

	return [status_message, request];

};




mavlink_messages.prototype.MAV_CMD_CONDITION_YAW = function(rover, data)
{

	// MAV_CMD_CONDITION_YAW  Reach a certain target angle.
	// Mission Param #1 target angle: [0-360], 0 is north
	// Mission Param #2 Empty
	// Mission Param #3 direction: negative: counter clockwise, positive: clockwise [-1,1]
	// Mission Param #4 relative offset or absolute angle: [ 1,0]
	// Mission Param #5 Empty
	// Mission Param #6 Empty
	// Mission Param #7 Empty

	var request = null;
	if (data.param1)
	{
		request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_CONDITION_YAW, 1, data.param1, data.param2, data.param3, data.param4, 0, 0, 0);

		var status_message = 'Yaw (Degrees: ' + data.param1 + ')';

	}
	else
	{
		var status_message = 'MAV_CMD_CONDITION_YAW: Missing Orientation';
	}

	return [status_message, request];
};



mavlink_messages.prototype.MAV_CMD_DO_SET_HOME = function(rover, data)
{

/*
  MAV_CMD_DO_SET_HOME Changes the home location either to the current location or a specified location.
Mission Param #1  Use current (1=use current location, 0=use specified location)
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Latitude
Mission Param #6  Longitude
Mission Param #7  Altitude
*/
	var request = null;
	var status_message = null;

	if (data.param5 && data.param6)
	{
		request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_DO_SET_HOME, 1, data.param1, 0, 0, 0, data.param5, data.param6, data.param7);

		status_message = 'Set Home (lat: ' + data.param5 + ', lon: ' + data.param6 + ', Altitude: ' + data.param7 + ')';

	}
	else
	{
		status_message = 'MAV_CMD_DO_SET_HOME: Missing Target lat/lon';
	}

	return [status_message, request];


};




mavlink_messages.prototype.MAV_CMD_NAV_RETURN_TO_LAUNCH = function(rover)
{

/*
20  MAV_CMD_NAV_RETURN_TO_LAUNCH  Return to launch location
Mission Param #1  Empty
Mission Param #2  Empty
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Empty
Mission Param #6  Empty
Mission Param #7  Empty
*/

	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH, 1, 0, 0, 0, 0, 0, 0, 0);

	var status_message = 'MAV_CMD_NAV_RETURN_TO_LAUNCH:  command sent';

	return [status_message, request];

};


mavlink_messages.prototype.MAV_CMD_DO_SET_MODE = function(rover, data)
{

/*
176 MAV_CMD_DO_SET_MODE Set system mode.
Mission Param #1  Mode, as defined by ENUM MAV_MODE
Mission Param #2  Custom mode - this is system specific, please refer to the individual autopilot specifications for details.
Mission Param #3  Custom sub mode - this is system specific, please refer to the individual autopilot specifications for details.
Mission Param #4  Empty
Mission Param #5  Empty
Mission Param #6  Empty
Mission Param #7  Empty
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_DO_SET_MODE, 1, data.param1, data.param2, data.param3, 0, 0, 0, 0);

	var status_message = 'MAV_CMD_DO_SET_MODE: set to ' + data.param2;

	return [status_message, request];

};


mavlink_messages.prototype.SET_MODE = function(rover, data)
{

/*
176 MAV_CMD_DO_SET_MODE Set system mode.
Mission Param #1  Mode, as defined by ENUM MAV_MODE
Mission Param #2  Custom mode - this is system specific, please refer to the individual autopilot specifications for details.
Mission Param #3  Custom sub mode - this is system specific, please refer to the individual autopilot specifications for details.
Mission Param #4  Empty
Mission Param #5  Empty
Mission Param #6  Empty
Mission Param #7  Empty
*/


	var request = new rover.mavlink.messages.set_mode(data.param1, data.param2, data.param3);

	var status_message = 'Set Mode: set to ' + data.param1;

	return [status_message, request];

};



mavlink_messages.prototype.MAV_CMD_DO_CHANGE_SPEED = function(rover, data)
{

/*
Sets the desired maximum speed in meters/second (only). Both the speed-type and throttle settings are ignored.
Mission Param #1  Empty
Mission Param #2  Target speed (m/s).
Mission Param #3  Empty
Mission Param #4  Empty
Mission Param #5  Empty
Mission Param #6  Empty
Mission Param #7  Empty
*/


	var request = new rover.mavlink.messages.command_long(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent, rover.mavlink.MAV_CMD_DO_CHANGE_SPEED, 1, 0, data.param2, 0, 0, 0, 0, 0);

	var status_message = 'MAV_CMD_DO_CHANGE_SPEED: changed to ' + data.param2;

	return [status_message, request];

};


mavlink_messages.prototype.MISSION_CLEAR_ALL = function(rover)
{

	var request = new rover.mavlink.messages.mission_clear_all(rover.pixhawk_port.targetSystem, rover.pixhawk_port.targetComponent);

	var status_message = 'mission_clear_all: command sent';

	return [status_message, request];

};



module.exports = new mavlink_messages();