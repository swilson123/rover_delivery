const { spawn } = require('child_process');

const lidar = spawn('./ultra_simple', ['--channel', '--serial', '/dev/ttyAMA2', '1000000'], {
  cwd: '../rplidar_sdk/output/Linux/Release'
});

lidar.stdout.setEncoding('utf8');

lidar.stdout.on('data', (data) => {
  const lines = data.split('\n');
  for (const line of lines) {
    const parsed = parseLidarOutput(line);
    if (parsed) {
      console.log(parsed);  // Do something with the data
    }
  }
});

lidar.stderr.on('data', (data) => {
  console.error(`LIDAR error: ${data}`);
});

lidar.on('close', (code) => {
  console.log(`ultra_simple exited with code ${code}`);
});

function parseLidarOutput(line) {
  const regex = /theta:\s*([\d.]+)\s*Dist:\s*([\d.]+)\s*Q:\s*(\d+)/;
  const match = line.match(regex);

  if (match) {
    return {
      angle: parseFloat(match[1]),
      distance: parseFloat(match[2]),
      quality: parseInt(match[3])
    };
  }

  return null;
}