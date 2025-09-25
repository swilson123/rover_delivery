var update_serialports = function (rover, show_ports) {

	// Ensure rover.SerialPort is initialized. Many versions of serialport export differently.
	if (!rover.SerialPort) {
		try {
			const sp = require('serialport');
			rover.SerialPort = sp.SerialPort || sp;
		} catch (err) {
			console.error('update_serialports: serialport not available', err && err.message);
			return;
		}
	}

	function handlePorts(ports) {
		ports.forEach(function (port) {
			if (show_ports) {
				console.log(port);
				if (rover.logs && rover.logs.serialports) rover.logs.serialports.log(rover, JSON.stringify(port));
			}

			if (port.manufacturer == 'Pozyx Labs') {
				if (rover.pozyx && rover.pozyx.on && !rover.pozyx.client) {
					rover.connect_to_pozyx && rover.connect_to_pozyx(rover);
				}
			} else if (port.serialNumber == 'FT2RT8YA') {
				if (!rover.nav || !rover.nav.comName) {
					rover.nav = rover.nav || {};
					rover.nav.comName = port.comName || port.path;
					rover.connect_to_nav_usb && rover.connect_to_nav_usb(rover);
				}
			} else if (port.productId == '0x0011' && port.vendorId == '0x26ac' || port.productId == '0x0011' && port.vendorId == '0x26AC' || port.productId == '0011' && port.vendorId == '26ac' || port.productId == '0011' && port.vendorId == '26AC' || port.productId == '0x5740' && port.vendorId == '0x0483' || port.productId == '5740' && port.vendorId == '0483' || port.productId == '0x2303' && port.vendorId == '0x067b' || port.productId == '2303' && port.vendorId == '067b' || port.productId == '0x1011' && port.vendorId == '0x2dae' || port.productId == '1011' && port.vendorId == '2dae') {
				if (rover.truck && rover.truck.on) {
					rover.truck_compass_port = rover.truck_compass_port || {};
					if (!rover.truck_compass_port.comName) {
						rover.truck_compass_port.comName = port.comName || port.path;
						rover.connect_to_compass && rover.connect_to_compass(rover);
					}
				} else {
					rover.pixhawk_port = rover.pixhawk_port || {};
					if (!rover.pixhawk_port.comName) {
						rover.pixhawk_port.comName = port.comName || port.path;
						rover.logs && rover.logs.serialports && rover.logs.serialports.log(rover, 'Pixhawk comName - ' + (port.comName || port.path));

						setTimeout(function () {
							rover.connect_to_robot_pixhawk && rover.connect_to_robot_pixhawk(rover);
						}, 8000);
					}
				}

			} else if (port.productId == '0x6001' && port.vendorId == '0x0403' || port.productId == '0x6015' && port.vendorId == '0x0403' || port.productId == '6001' && port.vendorId == '0403' || port.productId == '6015' && port.vendorId == '0403' || port.productId == 'EA60' && port.vendorId == '10C4' || port.productId == 'ea60' && port.vendorId == '10c4') {
				if (rover.truck && rover.truck.on) {
					rover.pixhawk_port = rover.pixhawk_port || {};
					if (!rover.pixhawk_port.comName) {
						rover.pixhawk_port.comName = port.comName || port.path;
						rover.pixhawk_port.radio = true;
						rover.logs && rover.logs.serialports && rover.logs.serialports.log(rover, 'Pixhawk comName - ' + (port.comName || port.path));
						rover.connect_to_robot_pixhawk && rover.connect_to_robot_pixhawk(rover);
					}
				}
			} else if (port.productId == '0x0043' && port.vendorId == '0x2341' || port.productId == '0043' && port.vendorId == '2341' || port.productId == '0x0042' && port.vendorId == '0x2341' || port.productId == '0042' && port.vendorId == '2341') {
				rover.arduino_port = rover.arduino_port || {};
				if (!rover.arduino_port.comName) {
					rover.logs && rover.logs.serialports && rover.logs.serialports.log(rover, 'Arduino comName: ' + (port.comName || port.path));
					rover.arduino_port.comName = port.comName || port.path;
					rover.connect_to_arduino && rover.connect_to_arduino(rover);
				}
			} else if (port.productId == '01A8' && port.vendorId == '1546' || port.productId == '0x01a8' && port.vendorId == '0x1546' || port.productId == '01a8' && port.vendorId == '1546') {
				rover.ublox_port = rover.ublox_port || {};
				if (!rover.ublox_port.comName) {
					console.log('U-blox comName: ' + (port.comName || port.path));
					rover.ublox_port.comName = port.comName || port.path;
					rover.connect_to_ublox && rover.connect_to_ublox(rover);
				}
			}

		});
	}

	// support both Promise-based list() and callback-based list()
	try {
		var listResult = rover.SerialPort.list && rover.SerialPort.list();
		if (listResult && typeof listResult.then === 'function') {
			listResult.then(function (ports) {
				handlePorts(ports);
			}).catch(function (err) {
				console.error('update_serialports: error listing ports', err);
			});
		} else if (typeof rover.SerialPort.list === 'function') {
			// fallback to callback style if available
			try {
				rover.SerialPort.list(function (err, ports) {
					if (err) return console.error('update_serialports: error listing ports', err);
					handlePorts(ports);
				});
			} catch (cbErr) {
				console.error('update_serialports: list() call failed', cbErr);
			}
		} else {
			console.error('update_serialports: SerialPort.list not available on this platform');
		}
	} catch (err) {
		console.error('update_serialports: unexpected error', err);
	}

};


module.exports = update_serialports;