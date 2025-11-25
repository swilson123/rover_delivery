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

    if (waypoint.latitude && waypoint.longitude) {

        //What is heading of the next waypoint?
        let waypoint_bearing = rover.get_bearing(rover.robot_data.robot_latitude, rover.robot_data.robot_longitude, waypoint.latitude, waypoint.longitude);
        //console.log("Next waypoint bearing: " + waypoint_bearing + " Rover heading: " + rover_heading);

        //yaw rover towards waypoint
        let yaw_to_waypoint = (waypoint_bearing - rover_heading + 360) % 360;
        if (yaw_to_waypoint > 180) yaw_to_waypoint -= 360;
        rover.robot_data.yaw_to_waypoint = yaw_to_waypoint;
        if (Math.abs(rover.robot_data.yaw_to_waypoint) > 20) {

            //determine motor speed command based on yaw angle
            motor_speed_cmd = Math.abs(rover.robot_data.yaw_to_waypoint);


            rover.yaw_rover(rover, rover.robot_data.yaw_to_waypoint, motor_speed_cmd);
        }
        else {


            //reset servos to straight.......................
           
            rover.servo_send_command(rover, 10, 1500);
           
            rover.servo_send_command(rover, 12, 1500);

            //steer towards waypoint complete, move forward
           var steer_pwm = rover.angle_to_pwm(rover.robot_data.yaw_to_waypoint);
            rover.servo_send_command(rover, 9, steer_pwm.servo2);
            rover.servo_send_command(rover, 11, steer_pwm.servo1);


            //What is the distance to the next waypoint?
            let distance_to_waypoint_meters = rover.gps_distance(rover.robot_data.robot_latitude, rover.robot_data.robot_longitude, waypoint.latitude, waypoint.longitude) * 1000;
            console.log("Distance to waypoint (meters): " + distance_to_waypoint_meters);

            //move forward towards waypoint
            if (distance_to_waypoint_meters > 2) {
                motor_speed_cmd = 200;
            }
            else if (distance_to_waypoint_meters <= 2) {
                //waypoint reached
                rover.mission.current_mission_seq += 1;
                motor_speed_cmd = 0;
            }


            setTimeout(() => {
                rover.move_rover(rover, 1, motor_speed_cmd * -1);
            }, 10);
            setTimeout(() => {
                rover.move_rover(rover, 2, motor_speed_cmd);
            }, 20);
            setTimeout(() => {
                rover.move_rover(rover, 3, motor_speed_cmd);
            }, 30);
            setTimeout(() => {
                rover.move_rover(rover, 4, motor_speed_cmd * -1);
            }, 40);

        }

    }
    else {
        console.log("Mission Finished. No waypoint data available.");
        clearInterval(rover.mission.mission_interval);
    }

};


module.exports = run_mission;