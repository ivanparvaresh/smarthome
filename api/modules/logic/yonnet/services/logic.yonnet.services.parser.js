module.exports = function (app) {
    app.factory("logic.yonnet.services.parser", ["sarina.logger"], function ($logger) {
        var handlers = [];
        return {
            registerHandler: function (commandCode, func) {
                handlers[commandCode] = func;
            },
            resolveHandler: function (commandCode) {
                return handlers[commandCode];
            },
            process: function (message) {
                var data =
                    message.split(";");
                var commandCode = data[2];
                var dataLenght = data[3];

                var args = [];
                for (var i = 3; i < data.length - 2; i++) {
                    args.push(data[i]);
                }
                var handler = this.resolveHandler(commandCode);
                var result = null;
                if (handler) {
                    result = handler(args);
                } else {
                    $logger.error("Handler not for message '" + message + "'");
                }


                return {
                    commandCode: commandCode,
                    result: result
                };
            },
        }
    });
}