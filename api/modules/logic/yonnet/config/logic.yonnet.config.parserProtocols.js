module.exports = function (app) {

    app.config("logic.yonnet.config.parserProtocols", ["logic.yonnet.services.parser"], function ($parser) {

        //login
        $parser.registerHandler("5", function (parameters) {
            var result = parameters[1];
            if (result == "1") {
                return true;
            } else {
                return false;
            }
        });
        //request table
        $parser.registerHandler("6", function (parameters) {
            var data = JSON.parse(parameters[2]);
            return data;
        });

    });
    
}