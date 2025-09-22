'use strict';

require('winston-daily-rotate-file');

var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    winston = require('winston'),
    logger = new winston.Logger(),
    production = (process.env.NODE_ENV || '').toLowerCase() === 'production';

module.exports = {
    middleware: function(req, res, next){
        console.info(req.method, req.url, res.statusCode);
        next();
    },
    production: production
};

var os = require("os");
var hostname = os.hostname();
var logpath = './logger/log';

// create dir recursively if it does not exist!


// write to a daily rotating file log
logger.add(winston.transports.DailyRotateFile, {
    filename: logpath,
    datePattern: 'yyyy-MM-dd.',
    prepend: true,      // add the date to the beginning of the file name
    timestamp: true,    // add a timestamp to each log entry
    localTime: true,    // rotate files based on local timezone
    json: false,        // write log entries as text, not json
    level: 'info',      // write any log entries of level info or above
    handleExceptions: true,
    exitOnError: false
});

// output log entries to console
logger.add(winston.transports.Console, {
    colorize: true,     // colorize log entries for easier reading
    timestamp: true,    // add a timestamp to each log entry
    level: 'info'
});


function formatArgs(args){
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function(){
    logger.info.apply(logger, formatArgs(arguments));
};
console.info = function(){
    logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function(){
    logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function(){
    logger.error.apply(logger, formatArgs(arguments));
};
console.debug = function(){
    logger.debug.apply(logger, formatArgs(arguments));
};