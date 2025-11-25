/*
#========================================================================================================================================== #
..................................................................Global Variables.........................................................
#========================================================================================================================================== #
*/


const rover = {
  gps: null,
  pixhawk_port: {
    comName: "/dev/ttyAMA2",
    baudrate: 115200,
    serial: null,
    mavlink: null,
    ping_num: 0,
    targetSystem: 1,
    targetComponent: 0,
    connected: false
  },
  gps: {
    latitude: 0,
    longitude: 0,
    altitude: 0,
  },
  lidar: {
    lidar_connected: false,
    red_light_green_light: null,
  },
  pixhawk: {},
  pixhawk_drone: {},
  message_count: 0,
  commandSystem: 1,
  commandComponent: 1,
  targetSystem: 1,
  targetComponent: 0,
  dateFormat: require('dateformat'),
  fs: require('fs'),
  net: require('net'),
  SerialPort: require("serialport").SerialPort, 
  Readline: require('@serialport/parser-readline').ReadlineParser,
  mavlink: require("./lib/pixhawk/mavlink2.js"),
  init_logs: require("./lib/logging/init_logs.js"),
  create_logs: require("./lib/logging/create_logs.js"),
  logging: require("./lib/logging/logging.js"),
  update_serialports: require('./lib/serial/update_serialports.js'),
  request_data_stream: require('./lib/pixhawk/request_data_stream.js'),
  mavlink_messages: require('./lib/pixhawk/mavlink_messages.js'),
  send_pixhawk_command: require('./lib/pixhawk/send_pixhawk_command.js'),
  pixhawk_message_handler: require('./lib/pixhawk/pixhawk_message_handler.js'),
  set_flight_mode: require('./lib/pixhawk/set_flight_mode.js'),
  update_mav_mode: require('./lib/pixhawk/update_mav_mode.js'),
  gpio_connect: require('./lib/gpio/gpio_connect.js'),
  lidar_connect: require('./lib/lidar/lidar_connect.js'),
  lidar_message_handler: require('./lib/lidar/lidar_message_handler.js'),
  GPS: require("gps"),
  gps_distance: require('gps-distance'),
  angles: require("angles"),
  bufferpack: require("bufferpack"),
  pixhawk_drone: require("./lib/pixhawk_drone.js"),
  connect_to_robot_pixhawk: require("./lib/pixhawk/connect_to_robot_pixhawk.js"),
  init_robotkit: require('./lib/robotkit/init_robotkit.js'),
  connect_to_sitl: require('./lib/robotkit/connect_to_sitl.js'),
  deliver_package: require('./lib/mission/deliver_package.js'),
  mission_item_reached: require('./lib/mission/mission_item_reached.js'),
  download_mission: require('./lib/mission/download_mission.js'),
  reset_rover: require('./lib/mission/reset_rover.js'),
  disarm_robot: require('./lib/pixhawk/disarm_robot.js'),
  mission_item_array: require('./lib/mission/mission_item_array.js'),
  guided_mode_command: require('./lib/mission/guided_mode_command.js'),
  avoid_object: require('./lib/mission/avoid_object.js'),
  get_bearing: require('./lib/mission/get_bearing.js'),
  servo_bed: require('./lib/servos/servo_bed.js'),
  servo_arm_driver_side: require('./lib/servos/servo_arm_driver_side.js'),
  servo_arm_passenger_side: require('./lib/servos/servo_arm_passenger_side.js'),
  servo_dump_tailer: require('./lib/servos/servo_dump_tailer.js'),
  set_delivery_type: require('./lib/package_delivery/set_delivery_type.js'),
  set_arm_delivery: require('./lib/package_delivery/set_arm_delivery.js'),
  set_dump_trailer_delivery: require('./lib/package_delivery/set_dump_trailer_delivery.js'),
  deliver_package_arm: require('./lib/package_delivery/deliver_package_arm.js'),
  deliver_package_dump_trailer: require('./lib/package_delivery/deliver_package_dump_trailer.js'),
  connect_to_devices: require('./lib/start_rover_devices/connect_to_devices.js'),
  preform_turn: require('./lib/mission/preform_turn.js'),
  delivery_device: null,
  servos: {
    arm_driver_side: { min_pwm: 750, trim_pwm: 1400, max_pwm: 2000, set_pwm: 750 },
    arm_passenger_side: { min_pwm: 1900, trim_pwm: 1250, max_pwm: 650, set_pwm: 1900 },
    dump_tailer: { min_pwm: 1000, trim_pwm: 1500, max_pwm: 1600, set_pwm: 1000 },
    bed: { min_pwm: 1000, trim_pwm: 1500, max_pwm: 2000, set_pwm: 1000 }
  },
  gpio:{
    connected: false
  },
  rplidar:{
    connected: false,
    comName: "/dev/ttyAMA3",
  },
  flight_mode_trigger: null,
  sitl: {
    on: false,
    port: 5760,
    host: '127.0.0.1',
    robotkit: null

  },
  logs: {
    count: 1
  },
  robot_data: {
    is_armed: false,
    missson_mode: false,
    robot_latitude: 0,
    robot_longitude: 0,
    LOCAL_POSITION_NED: {},
    GLOBAL_POSITION_INT: {
      lat: 0,
      lon: 0
    },
    HEARTBEAT: {},
    SYS_STATUS: {},
    STATUSTEXT: {},
    ATTITUDE: {},
    VFR_HUD: {},
    GLOBAL_POSITION_INT: {
      lat: 0,
      lon: 0
    },
    SERVO_OUTPUT_RAW: {},
    LOCAL_POSITION_NED: {},
    ATTITUDE_QUATERNION: {},
    HIGHRES_IMU: {},
    GPS_RAW_INT: {},
    PING: {},
    SYSTEM_TIME: {},
    RANGEFINDER: {},
    MISSION_CURRENT: {},
    COMMAND_ACK: {},
    PARAM_ACK: {},
    MISSION_ACK: {},
    PARAM_VALUE: {},
    DISTANCE_SENSOR: {}
  },
  flight_data: {
    mission_step: null,
    launch_location: {},
    land_location: {},
    current_location: {},
    horizontal_distance_m: 0,
    vertical_distance_m: 0,
    inflight: 0,
    flight_type: null,
    manual_intervention: null,
    control_type: null,
    robot_help: null,
    help_reason: null,
    robot_modem_signal_strength: null,
    robot_flight_mode: null,
    robot_alert: null,
    robot_delivery_state: null,
    robot_claw_state: null,
    robot_dropoff_status: null,
    travel_speed: null,
    mav_state: null,
    robot_base_mode: null,
    package_delivered: null,
    bowl_distance_m: null,
    land_robot: null,
    launch_command_received: null,
    recall_cammand_received: null

  },
  FlightModes: {
    0: 'Manual',
    1: 'Acro',
    3: 'Steering',
    4: 'Hold',
    5: 'Loiter',
    6: 'Follow',
    7: 'Simple',
    10: 'Auto',
    11: 'RTL',
    12: 'SMART_RTL',
    15: 'Guided',
    72: 'Circle'
  },
  MavStates: {
    0: 'MAV_STATE_UNINIT',
    1: 'MAV_STATE_BOOT',
    2: 'MAV_STATE_CALIBRATING',
    3: 'MAV_STATE_STANDBY',
    4: 'MAV_STATE_ACTIVE',
    5: 'MAV_STATE_CRITICAL',
    6: 'MAV_STATE_EMERGENCY',
    7: 'MAV_STATE_POWEROFF',
    8: 'MAV_STATE_ENUM_END'

  },
  altitude: {
    take_off_msl_alt_meters: 0,
    rangefinder_alt_meters: 0,
    relative_alt_meters: 0,
    msl_alt_meters: 0,
    updating_travel_alt: false
  },
  mission: {
    last_reached_mission_seq: 0,
    current_mission_seq: 0,
    mission_count: 0,
    package_delivered: false,
    waypoints: [],
    path_clear: true,

  },
  guided_mode_command_robot: {
    mav_frame: 8,
    type_mask: '0b100111111000',
    yaw_rate: 0.5,
  },
  zones: [
    { zone: 1, light: "red", min_angle: 30, max_angle: 60, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 2, light: "red", min_angle: 60, max_angle: 90, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 3, light: "red", min_angle: 90, max_angle: 120, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 4, light: "red", min_angle: 120, max_angle: 150, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 5, light: "red", min_angle: 150, max_angle: 180, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 6, light: "red", min_angle: 180, max_angle: 210, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 7, light: "red", min_angle: 210, max_angle: 240, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 8, light: "red", min_angle: 240, max_angle: 270, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 9, light: "red", min_angle: 270, max_angle: 300, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 10, light: "red", min_angle: 300, max_angle: 330, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 11, light: "red", min_angle: 330, max_angle: 360, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
    { zone: 12, light: "red", min_angle: 0, max_angle: 30, min_distance_mm: 100, max_distance_mm: 600, timestamp: null, distance_mm: null, angle: null },
  ],
  mav_version: 1,
      waveshare: {
        baudrate: 115200,
        port_path: '/dev/ttyAMA0', //ttyACM0 = usb, ttyAMA0 = gpio
        connected: false,
        serial: null,
        parser: null
    },
    connect_to_waveshare: require("./lib/waveshare/connect_to_waveshare"),
    create_waveshare_message: require("./lib/waveshare/create_waveshare_message"),
    radio_commands: require("./lib/radio_controller/radio_commands"),
    move_rover: require("./lib/waveshare/move_rover"),
    servo_send_command: require("./lib/servos/servo_send_command"),
    calculate_bearing: require("./lib/navigation/calculate_bearing"),
    go_to_waypoint: require("./lib/navigation/go_to_waypoint"),
    yaw_rover: require("./lib/navigation/yaw_rover"),
    run_mission: require("./lib/navigation/run_mission"),

};

// host information used by logging
rover.hostname = require('os').hostname();



//Logs: Create..............
rover.init_logs(rover);


//SITL: Software in the loop settings...................
if (rover.sitl.on) {

  rover.init_robotkit(rover);

  setTimeout(function () {
    rover.connect_to_sitl(rover);
  }, 2000);

}
else {
  //connect to pixhawk...............

}


rover.connect_to_waveshare(rover);

 setTimeout(function () {
rover.yaw_rover(rover, 90);
  }, 10000);

// command constants from Waveshare example (ddsm_example/json_cmd.h)
// const CMD_DDSM_CTRL = 10010;        // speed/current/position control
// const CMD_DDSM_CHANGE_ID = 10011;   // change motor ID
// const CMD_CHANGE_MODE = 10012;      // change mode
// const CMD_DDSM_ID_CHECK = 10031;    // query motor ID (only one motor connected)
// const CMD_DDSM_INFO = 10032;        // get info for a motor
// const CMD_HEARTBEAT_TIME = 11001;   // set heartbeat time

// const motor_id = 4
// const motor_speed_cmd = 200;


// send change ID (example: set motor with physical connection to ID 1 -> change to 2)
// Only one motor should be connected when sending this command
// setTimeout(() => {
//     if (rover.waveshare.connected) {
//       var message = { "T": CMD_DDSM_CHANGE_ID, "id": motor_id };
//         rover.create_waveshare_message(rover, message);
 

//     } else {
//         console.log("Waveshare not connected");
//     }
// }, 1000);

// setTimeout(() => {
//     if (rover.waveshare.connected) {
//         var message = { "T": CMD_CHANGE_MODE, "id": motor_id, "mode": 2 };
//         rover.create_waveshare_message(rover, message);
//     } else {
//         console.log("Waveshare not connected");
//     }
// }, 2000);

// // set heartbeat time (-1 disables automatic stop)
// setTimeout(() => {
//     if (rover.waveshare.connected) {
//         var message = { "T": CMD_HEARTBEAT_TIME, "time": 2000 };
//         rover.create_waveshare_message(rover, message);
//     } else {
//         console.log("Waveshare not connected");
//     }
// }, 3000);










