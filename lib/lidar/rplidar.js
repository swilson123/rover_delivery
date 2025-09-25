const EventEmitter = require('events');

// Lightweight RPLIDAR connector
// Exports an object with init(rover, opts) -> returns an emitter with stop()

module.exports = {
  init: function (rover, opts = {}) {
    const emitter = new EventEmitter();
    const SerialPort = (() => {
      try { const sp = require('serialport'); return sp.SerialPort || sp; } catch (e) { return require('serialport'); }
    })();
    const ByteLengthParser = (() => {
      try { return require('@serialport/parser-byte-length').ByteLengthParser; } catch (e) { return require('@serialport/parser-byte-length').ByteLengthParser; }
    })();

  const fs = require('fs');
  const path = require('path');
  const SCAN_CMD = Buffer.from([0xA5, 0x20]);
    const STOP_CMD = Buffer.from([0xA5, 0x25]);
    const INFO_CMD = Buffer.from([0xA5, 0x50]);

    let portPath = opts.port || null;
    let baudRate = opts.baud || 1000000; // default to 1,000,000 discovered during probe
    let parserLength = opts.parse ? 5 : 0;
    let port = null;

    function hex(buf) { return Array.from(buf).map(b => b.toString(16).padStart(2,'0')).join(' '); }

    function parseNode(chunk) {
      if (!chunk || chunk.length !== 5) return null;
      const b0 = chunk[0];
      const b1 = chunk[1];
      const b2 = chunk[2];
      const b3 = chunk[3];
      const b4 = chunk[4];
      const quality = b0 >> 2;
      const startFlag = (b0 & 0x1) === 1;
      const angleRaw = ((b1 >> 1) + (b2 << 7));
      const angle = angleRaw / 64.0;
      const distRaw = (b3 | (b4 << 8));
      const distance_mm = distRaw / 4.0;
      return { quality, startFlag, angle, distance_mm };
    }

  // Active probe: try each enumerated port at a list of baud rates and return the first that produces any data
    async function probePortsForRplidar() {
      // Honor explicit environment overrides
      const envPort = process.env.LIDAR_PORT;
      const envBaud = process.env.LIDAR_BAUD ? parseInt(process.env.LIDAR_BAUD, 10) : null;
      if (envPort) {
        return { path: envPort, baud: envBaud || baudRate };
      }

      const candidateBauds = [1000000, 115200, 230400, 256000, 57600];
      // prefer Silicon Labs CP210x / CP2102 devices often reported as vendorId 10c4 productId ea60
      const preferredVid = '10c4';
      const preferredPid = 'ea60';
      let list = [];
      try { list = await (SerialPort.list ? SerialPort.list() : require('serialport').list()); } catch (e) { /* ignore */ }
      if (!list || list.length === 0) return null;

      // Put preferred devices first so we try likely adapters earlier
      try {
        list.sort((a, b) => {
          const aVid = (a.vendorId || '').toLowerCase();
          const aPid = (a.productId || '').toLowerCase();
          const bVid = (b.vendorId || '').toLowerCase();
          const bPid = (b.productId || '').toLowerCase();
          const aMatch = (aVid === preferredVid && aPid === preferredPid) ? 1 : 0;
          const bMatch = (bVid === preferredVid && bPid === preferredPid) ? 1 : 0;
          return bMatch - aMatch;
        });
      } catch (e) { /* ignore sort errors */ }

      for (const p of list) {
        const path = p.path || p.comName || p.device || p.port || p.filename;
        if (!path) continue;
        for (const baud of candidateBauds) {
          try {
            const trial = new SerialPort({ path: path, baudRate: baud, autoOpen: false });
            const saw = await new Promise((resolve, reject) => {
              let seen = false;
              let timer;
              trial.open((err) => {
                if (err) return reject(err);
                // collect any bytes briefly
                const onData = (chunk) => { seen = true; if (trial && trial.isOpen) { try { trial.removeListener('data', onData); } catch(e){} } };
                trial.on('data', onData);
                // send INFO then SCAN
                try { trial.write(Buffer.from([0xA5, 0x50])); } catch(e){}
                setTimeout(() => { try { trial.write(Buffer.from([0xA5, 0x20])); } catch(e){} }, 80);
                timer = setTimeout(() => {
                  try { trial.removeListener('data', onData); } catch(e){}
                  try { trial.close(() => { resolve(seen); }); } catch(e) { resolve(seen); }
                }, 700);
              });
            });
            if (saw) return { path: path, baud: baud };
          } catch (e) {
            // ignore errors and try next
          }
        }
      }
      return null;
    }

    const cacheFile = path.join(process.cwd(), '.rplidar_cache.json');

    function readCache() {
      try {
        if (!fs.existsSync(cacheFile)) return null;
        const j = JSON.parse(fs.readFileSync(cacheFile, 'utf8')) || null;
        if (j && j.path) return j;
      } catch (e) { /* ignore */ }
      return null;
    }

    function writeCache(obj) {
      try { fs.writeFileSync(cacheFile, JSON.stringify(obj)); } catch (e) { /* ignore */ }
    }

    async function start() {
      // If LIDAR_PORT provided in env or opts, prefer that. Otherwise try cached pair, then actively probe
      if (!portPath) {
        const envPort = process.env.LIDAR_PORT;
        const envBaud = process.env.LIDAR_BAUD ? parseInt(process.env.LIDAR_BAUD,10) : null;
        if (envPort) {
          portPath = envPort;
          baudRate = envBaud || baudRate;
        } else {
          const cached = readCache();
          if (cached && cached.path) {
            portPath = cached.path;
            baudRate = cached.baud || baudRate;
          } else {
            const found = await probePortsForRplidar();
            if (!found || !found.path) {
              emitter.emit('error', new Error('No serial port found for RPLIDAR'));
              return emitter;
            }
            portPath = found.path;
            baudRate = found.baud || baudRate;
          }
        }
      }

      port = new SerialPort({ path: portPath, baudRate: baudRate, autoOpen: false });

      port.on('error', (err) => { emitter.emit('error', err); });

      // Try to open with a few retries/backoff in case the device is temporarily locked by another process
      const maxAttempts = 5;
      let attempt = 0;
      async function tryOpen() {
        attempt++;
        return new Promise((resolve, reject) => {
          port.open((err) => {
            if (!err) return resolve();
            // If resource temporarily unavailable, consider retrying
            const msg = (err && err.message) ? err.message.toLowerCase() : '';
            if ((msg.includes('resource temporarily unavailable') || msg.includes('device or resource busy') || msg.includes('access denied')) && attempt < maxAttempts) {
              const backoff = 200 * attempt; // ms
              setTimeout(() => {
                tryOpen().then(resolve).catch(reject);
              }, backoff);
              return;
            }
            return reject(err);
          });
        });
      }

      try {
        await tryOpen();
      } catch (err) {
        emitter.emit('error', err);
        return emitter;
      }

      // persist successful port/baud for faster startup next time
      try { writeCache({ path: portPath, baud: baudRate }); } catch (e) { }

      // opened
      emitter.emit('open', { path: portPath, baud: baudRate });
      try { port.write(INFO_CMD); } catch(e){}
      setTimeout(() => { try { port.write(SCAN_CMD); } catch(e){} }, 80);

      if (parserLength && parserLength > 0) {
        const parser = port.pipe(new ByteLengthParser({ length: parserLength }));
        parser.on('data', (chunk) => {
          const node = parseNode(chunk);
          if (node) emitter.emit('data', node);
          else emitter.emit('raw', chunk);
        });
      } else {
        port.on('data', (chunk) => { emitter.emit('raw', chunk); });
      }

      return emitter;
    }

    emitter.stop = function () {
      try {
        if (port && port.isOpen) {
          port.write(STOP_CMD, () => {
            setTimeout(() => { try { port.close(()=>{}); } catch(e){} }, 200);
          });
        }
      } catch (e) {}
    };

    // start async
    process.nextTick(() => { start().catch && start().catch((e) => emitter.emit('error', e)); });

    return emitter;
  }
};
