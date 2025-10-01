var lidar_message_handler = function (rover, message) {
    if (message && !rover.lidar.lidar_connected) {
        console.log('LIDAR Connected:', message);
        rover.lidar.lidar_connected = true;
    }


    //console.log('LIDAR Data:', message);


    // Expect message to be an object: { quality, startFlag, angle, distance_mm }
    if (message && typeof message === 'object' && typeof message.angle === 'number' && typeof message.distance_mm === 'number') {
        // Normalize angle to [0, 360)
        let angle = message.angle % 360;
        if (angle < 0) angle += 360;

        // Update zones if angle and distance match
        if (Array.isArray(rover.zones)) {
            rover.zones.forEach((zone) => {
                if (
                    angle >= zone.min_angle && angle < zone.max_angle &&
                    message.distance_mm >= zone.min_distance_mm && message.distance_mm < zone.max_distance_mm
                ) {
                    zone.timestamp = Date.now();
                    zone.distance_mm = message.distance_mm;
                    zone.angle = angle;
                }
            });
        }


    }

    // Manage red/green light status based on zone activity
    if (!rover.lidar.red_light_green_light) {
        rover.lidar.red_light_green_light = setInterval(() => {


            for (var i = 0; i < rover.zones.length; i++) {

                if (rover.zones[i].timestamp + 1000 > Date.now()) {

                    rover.zones[i].light = "red";

                    console.log("Zone", rover.zones[i].zone, "red light");
                }
                else {
                    rover.zones[i].light = "green";
                    console.log("Zone", rover.zones[i].zone, "green light");
                }

            }

            rover.avoid_object(rover);
        }, 2000);
    }

};


module.exports = lidar_message_handler;