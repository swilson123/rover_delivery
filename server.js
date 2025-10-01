
// Check for conflicting processes using the lidar serial port before starting

const { exec } = require('child_process');
const disarm_robot = require('./lib/pixhawk/disarm_robot.js');
const lidarPortPath = '/dev/tty.usbserial-21340';
exec(`lsof | grep ${lidarPortPath}`, (err, stdout, stderr) => {
  // Ignore exit code 1 (no match found), only treat other errors as real errors
  if (err && err.code !== 1) {
    console.error('Error running lsof:', err);
  } else if (stdout.trim().length === 0) {
    console.log(`No processes are using ${lidarPortPath}.`);
  } else {
    console.log(`Processes using ${lidarPortPath} (PID first column):\n`);
    console.log(stdout);
    // Auto-kill all PIDs found in the first column
    const lines = stdout.trim().split('\n');
    const pids = Array.from(new Set(lines.map(line => line.trim().split(/\s+/)[1])));
    let killCount = 0;
    let killErrors = [];
    let killDone = () => {
      // Wait 1 second after killing processes to allow OS to release the port
      setTimeout(() => {
        if (killErrors.length > 0) {
          console.error('Some processes failed to be killed:', killErrors);
        }
        console.log('Waited 1 second for port release after killing processes.');
        // Continue with startup here if needed
      }, 1000);
    };
    if (pids.length === 0) {
      killDone();
    } else {
      pids.forEach(pid => {
        if (/^\d+$/.test(pid)) {
          exec(`kill -9 ${pid}`, (killErr) => {
            killCount++;
            if (killErr) {
              killErrors.push(`PID ${pid}: ${killErr.message}`);
            } else {
              console.log(`Killed process using ${lidarPortPath}: PID ${pid}`);
            }
            if (killCount === pids.length) {
              killDone();
            }
          });
        } else {
          killCount++;
          if (killCount === pids.length) {
            killDone();
          }
        }
      });
    }
  }
});

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
  update_mav_mode: require('./lib/pixhawk/update_mav_mode.js'),
  lidar_message_handler: require('./lib/lidar/lidar_message_handler.js'),
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
  disarm_robot: require('./lib/pixhawk/disarm_robot.js'),
  mission_item_array: require('./lib/mission/mission_item_array.js'),
  guided_mode_command: require('./lib/mission/guided_mode_command.js'),
  avoid_object: require('./lib/mission/avoid_object.js'),
  get_bearing: require('./lib/mission/get_bearing.js'),
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
else {
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






