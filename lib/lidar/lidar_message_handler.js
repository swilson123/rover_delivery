var lidar_message_handler = function (rover, message) {
if(message && !rover.lidar.lidar_connected){
    console.log('LIDAR Connected:', message);
    rover.lidar.lidar_connected = true;
}
//console.log('LIDAR Message Received:', message);

};


module.exports = lidar_message_handler;