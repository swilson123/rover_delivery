var update_serialports = function(rover, show_ports)
	{

		rover.SerialPort.list(function(err, ports)
		{
			ports.forEach(function(port)
			{
				if (show_ports)
				{
					console.log(port);
					rover.logs.serialports.log(rover, JSON.stringify(port));

				}

				if (port.manufacturer == 'Pozyx Labs')
				{
					//Connect to Software In The Loop............................................
					if (rover.pozyx.on && !rover.pozyx.client)
					{
						rover.connect_to_pozyx(rover);
					}
				}
				else if (port.serialNumber == 'FT2RT8YA')
				{
					if (!rover.nav.comName)
					{
						rover.nav.comName = port.comName;
						rover.connect_to_nav_usb(rover);
					}
				}
				else if (port.productId == '0x0011' && port.vendorId == '0x26ac' || port.productId == '0x0011' && port.vendorId == '0x26AC' || port.productId == '0011' && port.vendorId == '26ac' || port.productId == '0011' && port.vendorId == '26AC' || port.productId == '0x5740' && port.vendorId == '0x0483' || port.productId == '5740' && port.vendorId == '0483' || port.productId == '0x2303' && port.vendorId == '0x067b' || port.productId == '2303' && port.vendorId == '067b' || port.productId == '0x1011' && port.vendorId == '0x2dae' || port.productId == '1011' && port.vendorId == '2dae')
				{
					//pixhawk usb ports..........
					if (rover.truck.on)
					{
						if (!rover.truck_compass_port.comName)
						{
							rover.truck_compass_port.comName = port.comName;
							rover.connect_to_compass(rover);
						}
					}
					else if (!rover.pixhawk_port.comName)
					{

						rover.pixhawk_port.comName = port.comName;
						rover.logs.serialports.log(rover, 'Pixhawk comName - ' + port.comName);

						setTimeout(function()
						{
							//Give pixhawk a chance to boot..................
							rover.connect_to_robot_pixhawk(rover);
						}, 8000);
					}

				}
				else if (port.productId == '0x6001' && port.vendorId == '0x0403' || port.productId == '0x6015' && port.vendorId == '0x0403' || port.productId == '6001' && port.vendorId == '0403' || port.productId == '6015' && port.vendorId == '0403' || port.productId == 'EA60' && port.vendorId == '10C4' || port.productId == 'ea60' && port.vendorId == '10c4')
				{
					//Radio usb Ports............
					if (rover.truck.on)
					{
						if (!rover.pixhawk_port.comName)
						{
							rover.pixhawk_port.comName = port.comName;
							rover.pixhawk_port.radio = true;
							rover.logs.serialports.log(rover, 'Pixhawk comName - ' + port.comName);
							rover.connect_to_robot_pixhawk(rover);
						}
					}
				}
				else if (port.productId == '0x0043' && port.vendorId == '0x2341' || port.productId == '0043' && port.vendorId == '2341' || port.productId == '0x0042' && port.vendorId == '0x2341' || port.productId == '0042' && port.vendorId == '2341')
				{
					if (!rover.arduino_port.comName)
					{
						rover.logs.serialports.log(rover, 'Arduino comName: ' + port.comName);
						rover.arduino_port.comName = port.comName;
						rover.connect_to_arduino(rover);
					}
				}
				else if (port.productId == '01A8' && port.vendorId == '1546' || port.productId == '0x01a8' && port.vendorId == '0x1546' || port.productId == '01a8' && port.vendorId == '1546')
				{

					if (!rover.ublox_port.comName)
					{
						console.log('U-blox comName: ' + port.comName);
						rover.ublox_port.comName = port.comName;
						rover.connect_to_ublox(rover);
					}
				}


			});
		});
	};


module.exports = update_serialports;