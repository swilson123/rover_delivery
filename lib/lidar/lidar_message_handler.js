var lidar_message_handler = function (rover, message) {
if (message && !rover.lidar.lidar_connected) {
    console.log('LIDAR Connected:', message);
    rover.lidar.lidar_connected = true;
}

if(message.quality > 50){
    console.log('LIDAR Data:', message);
}

// Expect message to be an object: { quality, startFlag, angle, distance_mm }
if (message && typeof message === 'object' && typeof message.angle === 'number' && typeof message.distance_mm === 'number') {
    // Normalize angle to [0, 360)
    let angle = message.angle % 360;
    if (angle < 0) angle += 360;
    // Only consider high-quality lidar returns
    if (typeof message.quality === 'number' && message.quality >= 50) {
        // Define detection zone: e.g., +/- 30 degrees from front (0/360)
    const frontZone = (a) => (a >= 330 || a <= 30);
    const minDistance = 100; // mm
    const obstacleThreshold = 500; // mm, adjust as needed
    if (frontZone(angle) && message.distance_mm >= minDistance && message.distance_mm < obstacleThreshold) {
            // Obstacle detected in front
            if (!rover.lidar.avoiding_obstacle) {
                console.log('Obstacle detected! Angle:', angle, 'Distance:', message.distance_mm, 'Quality:', message.quality);
                rover.lidar.avoiding_obstacle = true;
                // Command Pixhawk to avoid obstacle (implement your avoidance logic here)
                if (typeof rover.pixhawk !== 'undefined' && typeof rover.pixhawk.avoidObstacle === 'function') {
                    rover.pixhawk.avoidObstacle({ ...message, angle });
                } else {
                    console.log('Pixhawk avoidance command not implemented.');
                }
            }
        } else if (rover.lidar.avoiding_obstacle && (!frontZone(angle) || message.distance_mm >= obstacleThreshold)) {
            // Path is clear, resume mission
            console.log('Path clear, resuming mission.');
            rover.lidar.avoiding_obstacle = false;
            if (typeof rover.pixhawk !== 'undefined' && typeof rover.pixhawk.resumeMission === 'function') {
                rover.pixhawk.resumeMission();
            } else {
                console.log('Pixhawk resume command not implemented.');
            }
        }
    }
}

};


module.exports = lidar_message_handler;