var connect_to_devices = function (rover) {

   rover.update_serialports(rover, true);
    
    if (rover.rplidar.connected === false) {
        rover.lidar_connect(rover);
    }

    if (rover.pixhawk_port.connected === false) {
        //Serial: Start...................................
        rover.connect_to_robot_pixhawk(rover);
    }
    else {

        //GPIO: Start...................................
        if (rover.gpio.connected === false) {
            rover.gpio_connect(rover);
        }
    }

};


module.exports = connect_to_devices;