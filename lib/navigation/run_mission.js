var run_mission = function (rover) {
    //run_mission command.....................
    let rover_heading = rover.robot_data.VFR_HUD.heading || 0;
    let motor_speed_cmd = 0;

    //What is the next waypoint?
    let waypoint = { latitude: null, longitude: null };
    for (let i = 0; i < rover.mission.waypoints.length; i++) {
        if (rover.mission.waypoints[i].seq == rover.mission.current_mission_seq) {
            waypoint.latitude = rover.mission.waypoints[i].lat;
            waypoint.longitude = rover.mission.waypoints[i].lng;
        }
    }
    //What is heading of the next waypoint?
    let waypoint_bearing = rover.get_bearing(rover.robot_data.robot_latitude, rover.robot_data.robot_longitude, waypoint.latitude, waypoint.longitude);
    console.log("Next waypoint bearing: " + waypoint_bearing + " Rover heading: " + rover_heading);

    //yaw rover towards waypoint
    let yaw_to_waypoint = (waypoint_bearing - rover_heading + 360) % 360;
    if (yaw_to_waypoint > 180) yaw_to_waypoint -= 360;
    rover.robot_data.yaw_to_waypoint = yaw_to_waypoint;
    if (Math.abs(rover.robot_data.yaw_to_waypoint) > 5) {

        //determine motor speed command based on yaw angle
        motor_speed_cmd = Math.abs(rover.robot_data.yaw_to_waypoint);


        rover.yaw_rover(rover, rover.robot_data.yaw_to_waypoint, motor_speed_cmd);
    }
    else {
        //stop rover from yawing
        rover.move_rover(rover, 1, 0);
        rover.move_rover(rover, 2, 0);
        rover.move_rover(rover, 3, 0);
        rover.move_rover(rover, 4, 0);

        //reset servos to straight.......................
        rover.servo_send_command(rover, 9, 1500);
        rover.servo_send_command(rover, 10, 1500);
        rover.servo_send_command(rover, 11, 1500);
        rover.servo_send_command(rover, 12, 1500);


    }

};


module.exports = run_mission;