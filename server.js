/*
#========================================================================================================================================== #
..................................................................Global Variables.........................................................
#========================================================================================================================================== #
*/

const rover = {
  gps: null,
  pixhawk_port: {
    comName: null,
    baudrate: 57600,
    serial: null,
    mavlink: null,
    ping_num: 0,
    targetSystem: 1,
    targetComponent: 1
  },
  gps: {
    latitude: 0,
    longitude: 0,
    altitude: 0,
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
  // SerialPort: require("serialport").SerialPort, // old API
  // use the modern serialport export; we'll keep the constructor available below
  SerialPort: null,
  mavlink: require("./lib/pixhawk/mavlink.js"),
  init_logs: require("./lib/logging/init_logs.js"),
  create_logs: require("./lib/logging/create_logs.js"),
  logging: require("./lib/logging/logging.js"),
  update_serialports: require('./lib/serial/update_serialports.js'),
  request_data_stream: require('./lib/pixhawk/request_data_stream.js'),
  mavlink_messages: require('./lib/pixhawk/mavlink_messages.js'),
  send_pixhawk_command: require('./lib/pixhawk/send_pixhawk_command.js'),
  pixhawk_message_handler: require('./lib/pixhawk/pixhawk_message_handler.js'),
  set_flight_mode: require('./lib/pixhawk/set_flight_mode.js'),
  GPS: require("gps"),
  angles: require("angles"),
  bufferpack: require("bufferpack"),
  pixhawk_drone: require("./lib/pixhawk_drone.js"),
  init_robotkit: require('./lib/robotkit/init_robotkit.js'),
  connect_to_sitl: require('./lib/robotkit/connect_to_sitl.js'),
  deliver_package: require('./lib/mission/deliver_package.js'),
  mission_item_reached: require('./lib/mission/mission_item_reached.js'),
  download_mission: require('./lib/mission/download_mission.js'),
  reset_rover: require('./lib/mission/reset_rover.js'),
  mission_item_array: require('./lib/mission/mission_item_array.js'),
  delivery_device: 'dump_trailer',
  flight_mode_trigger: null,
  sitl: {
    on: true,
    port: 5760,
    host: '127.0.0.1',
    robotkit: null

  },
  logs: {
    count: 1
  },
  robot_data: {
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
    0: 'Stabilize',
    1: 'Acro',
    2: 'AltHold',
    3: 'Auto',
    4: 'Guided',
    5: 'Loiter',
    6: 'RTL',
    7: 'Circle',
    9: 'Land',
    11: 'Drift',
    13: 'Sport',
    14: 'Flip',
    15: 'AutoTune',
    16: 'PosHold',
    17: 'Brake',
    18: 'THROW',
    19: 'AVOID_ADSB',
    20: 'GUIDED_NOGPS',
    21: 'SMART_RTL',
    22: 'FLOWHOLD',
    23: 'FOLLOW'
  },
  altitude: {
    take_off_msl_alt_meters: 0,
    rangefinder_alt_meters: 0,
    relative_alt_meters: 0,
    msl_alt_meters: 0,
    updating_travel_alt: false
  },
  mission: {
    current_mission_seq: 0,
    mission_count: 0,
    package_delivered: false,
    waypoints: []

  },
  mav_version: 2,
};

// host information used by logging
rover.hostname = require('os').hostname();

//Ports: define...................................

async function update_serialports(show_ports) {
  // lazy-require serialport to avoid throwing at module load if native bindings missing
  if (!rover.SerialPort) {
    try {
      const sp = require('serialport');
      // serialport v9+ exports SerialPort and a static list() method that returns a Promise
      rover.SerialPort = sp.SerialPort || sp;
    } catch (err) {
      console.error('update_serialports: failed to require serialport', err);
      return;
    }
  }

  try {
    const ports = await rover.SerialPort.list();
    ports.forEach(function (port) {
      if (show_ports) {
        console.log(port);
      } else if (!rover.pixhawk_port.comName) {
        // set first available port as pixhawk comName (keep existing behavior but fixed condition)
        console.log('Pixhawk comName: ' + port.path || port.comName);
        rover.pixhawk_port.comName = port.path || port.comName;
        if (typeof connect_to_pixhawk === 'function') {
          connect_to_pixhawk();
        }
      }
    });
  } catch (err) {
    console.error('update_serialports: error listing ports', err);
  }
}


//Logs: Create..............
rover.init_logs(rover);


//SITL: Software in the loop settings...................
if (rover.sitl.on) {

  rover.init_robotkit(rover);

  setTimeout(function () {
    rover.connect_to_sitl(rover);
  }, 2000);

}
else{
  //connect to pixhawk...............
  
}

// Auto-start RPLIDAR when server starts (if not SITL or even if SITL depending on opts)
try {
  const rplidar = require('./lib/lidar/rplidar.js');
  // start with defaults; parse mode enabled
  rover.lidar = rplidar.init(rover, { parse: true });
  rover.lidar.on('open', (info) => { console.log('RPLIDAR connected', info); });
  rover.lidar.on('data', (node) => {
    // node: { quality, startFlag, angle, distance_mm }
    const line = `LIDAR angle=${node.angle.toFixed(2)} distance=${node.distance_mm.toFixed(2)} quality=${node.quality} start=${node.startFlag}`;
    console.log(line);
    // optionally store last reading on rover
    rover.last_lidar = node;
  });
  rover.lidar.on('raw', (chunk) => { /* ignore raw by default */ });
  rover.lidar.on('error', (err) => { console.error('RPLIDAR error', err && err.message); });
} catch (e) {
  console.warn('RPLIDAR module not available or failed to start:', e && e.message);
}


