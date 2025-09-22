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
  SerialPort: require("serialport").SerialPort,
  mavlink: require("./lib/mavlink.js"),
  init_logs: require("./lib/logging/init_logs.js"),
	create_logs: require("./lib/logging/create_logs.js"),
	logging: require("./lib/logging/logging.js"),
  net: require('net'),
  GPS: require("gps"),
  angles: require("angles"),
  bufferpack: require("bufferpack"),
  pixhawk_drone: require("./lib/pixhawk_drone.js"),
  init_robotkit: require('./lib/robotkit/init_robotkit.js'),
	connect_to_sitl: require('./lib/robotkit/connect_to_sitl.js'),
  	sitl: {
		on: true,
		port: 5760,
		host: '127.0.0.1',
		robotkit: null

	},
};

//Ports: define...................................

function update_serialports(show_ports) {
  rover.SerialPort.list(function (err, ports) {
    ports.forEach(function (port) {
      if (show_ports) {
        console.log(port);
      } else if (!rover.pixhawk_port.comName == "pixhawk") {
        console.log("Pixhawk comName: " + port.comName);
        rover.pixhawk_port.comName = port.comName;
        connect_to_pixhawk();
      }
    });
  });
}

//Connect on load.........................................................

update_serialports(true);

setInterval(function () {
  //Retry connection...........
  update_serialports(false);
}, 5000);





//SITL: Software in the loop settings...................
if (rover.sitl.on)
{

	rover.init_robotkit(rover);

	setTimeout(function()
	{
		rover.connect_to_sitl(rover);
	}, 2000);

}

/*
#========================================================================================================================================== #
..................................................................USB/Serial Pixhawk...........................................................
#========================================================================================================================================== #
*/

//Open pixhawk port..........................................

function connect_to_pixhawk() {
  if (rover.pixhawk_port.comName) {
    rover.pixhawk_port.serial = new rover.SerialPort(rover.pixhawk_port.comName, {
      baudRate: rover.pixhawk_port.baudrate,
    });

    //When port is open, start up mavlink
    rover.pixhawk_port.serial.on("open", function () {
      console.log("Pixhawk Port is open");

      rover.pixhawk_port.mavlink = new mavlink(1, 1);

      rover.pixhawk_port.mavlink.setConnection(rover.pixhawk_port.serial);

      rover.messages.pixhawk.connected = true;

      //Parse any new incoming data

      rover.pixhawk_port.serial.on("data", function (data) {
        //console.log(data);
        if (!rover.messages.pixhawk_drone.connected) {
          rover.messages.pixhawk_drone.connected = true;
          send_to_pixhawk(
            1,
            1,
            rover.mavlink.MAV_DATA_STREAM_ALL,
            100,
            1,
            "request_data_stream"
          );
        }

        rover.pixhawk_port.mavlink.parseBuffer(data);
      });

      //On pixhawk usb/serial port message...........................
      rover.pixhawk_port.mavlink.on("message", function (message) {
        var data = {
          from_src: "radio_pixhawk",
          message: message.name,
          system: message.system,
          component: message.component,
          id: message.id,
          date: new Date(),
          data: message,
        };

        console.log(data.data);
      });
    });

    rover.pixhawk_port.serial.on("error", function (e) {
      console.log("Serial Port error: ", e);
      rover.pixhawk_port.serial = null;
      rover.messages.pixhawk.connected = false;
      rover.messages.pixhawk_drone.connected = false;
      rover.pixhawk_port.comName = null;
    });
  } else {
    console.log("Missing pixhawk port");
  }
}

//Send message to pixhawk....................................

function send_to_pixhawk(
  target_system,
  target_component,
  req_stream_id,
  req_message_rate,
  start_stop,
  command
) {
  if (rover.pixhawk_port.mavlink) {
    if (rover.messages.pixhawk_drone.connected) {
      var request = null;

      if (command == "request_data_stream") {
        request = new rover.mavlink.messages.request_data_stream(
          target_system,
          target_component,
          req_stream_id,
          req_message_rate,
          start_stop
        );
      } else {
        console.log("Unknown Command");
      }

      if (request) {
        console.log("Request", request);
        rover.pixhawk_port.mavlink.send(request);
      } else {
        console.log("Request not found");
      }
    } else {
      console.log("Drone not connected to mavlink");
    }
  } else {
    console.log("Pixhawk Mavlink Port not found");
  }
}

//Send message to pixhawk....................................

function send_pixhawk_command(
  target_system,
  target_component,
  command,
  confirmation,
  param1,
  param2,
  param3,
  param4,
  param5,
  param6,
  param7
) {
  if (rover.pixhawk_port.mavlink) {
    var request = null;
    request = new rover.mavlink.messages.command_long(
      target_system,
      target_component,
      command,
      confirmation,
      param1,
      param2,
      param3,
      param4,
      param5,
      param6,
      param7
    );

    if (request) {
      console.log("Mav Command", request);
      rover.pixhawk_port.mavlink.send(request);
    } else {
      console.log("Command Request Not Found");
    }
  }
}
