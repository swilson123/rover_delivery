var logging = function(rover, page)
	{

		var winston = require('winston');
		require('winston-daily-rotate-file');

        var date = rover.dateFormat.default(new Date(), "yyyy-mm-dd");

		var transport = new(winston.transports.DailyRotateFile)(
		{
			filename: 'logger/'+ rover.date + '/' + rover.logs.count +'/' + page + '-%DATE%.log',
			datePattern: 'YYYY-MM-DD-HH',
			zippedArchive: false,
			maxSize: '20m',
			maxFiles: '30d'
		});

		transport.on('rotate', function(oldFilename, newFilename)
		{
			// do something fun
		});

        this.page = page;

		this.logger = winston.createLogger(
		{
			transports: [
			transport]
		});

	};

logging.prototype.log = function(rover, message)
{
    var timestamp = rover.dateFormat.default(new Date(), "yyyy-mm-dd HH:MM:ss");


	this.logger.info("...................."+timestamp +" "+this.page+": "+message);

};

module.exports = logging;