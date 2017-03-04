var winston = require('winston');
module.exports = function (sarina) {

    sarina.factory("sarina.logger", ["options"], function (options) {

        winston.addColors({
            'debug': 'yellow',
            'info': 'green',
            'error': 'red'
        });
        var logger = new winston.Logger({
            transports: [
                new (winston.transports.File)({
                    name: 'info-file',
                    filename: options.log.file,
                    handleExceptions: true,
                    level: "debug",
                    json: false
                }),
                new winston.transports.Console({
                    handleExceptions: true,
                    json: false,
                    colorize: true,
                    level: 'info',
                    timestamp: function () {
                        return Date.now();
                    },
                    formatter: function (options) {
                        var result = (options.message ? options.message : '');
                        if (options.level.toUpperCase() == 'ERROR') {
                            if (options.meta && Object.keys(options.meta).length) {
                                if (options.meta.trace) {
                                    for (var i = 0; i < options.meta.trace.length; i++) {
                                        result += '\n\t in ' + options.meta.trace[i].file + ' (' + options.meta.trace[i].line + "," + options.meta.trace[i].column + ') ' + ((options.meta.trace[i].method) ? '"' + options.meta.trace[i].method + '" ' : '');

                                    }
                                }
                            }

                            result = "\x1b[31m" + "Error: " + result + "\x1b[0m";
                        }
                        if (options.level.toUpperCase() == 'WARNING') {
                            result = "\x1b[36m" + "Warning: " + result + "\x1b[0m";
                        }
                        if (options.level.toUpperCase() == 'DEBUG') {
                            result = "\x1b[33m" + "Debug: " + result + "\x1b[0m";
                        }
                        return result;
                    }
                })
            ],
            exitOnError: false
        });


        return logger;
    })

}