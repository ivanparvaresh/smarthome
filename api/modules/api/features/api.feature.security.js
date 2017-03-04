var bodyParser = require('body-parser');

module.exports = function (sarina) {
    sarina.config("api.feature.security",
        [
            "sarina.logger",
            "sarina.express.app",
            "logic.services.controller"
        ],
        function ($logger, $express, $controller) {

            function handleError(res, err) {
                $logger.error(err);
                res.send(err);
            }

            $express.post("/api/1/login", function (req, res) {

                $logger.debug("Login request received...")
                var username = req.body.username;
                var password = req.body.password;

                $controller.findTokenByUsernameAndPassword(username, password)
                    .then(function (device) {

                        var safeDevice = JSON.parse(JSON.stringify(device.$config));
                        safeDevice.password = "**********";
                        safeDevice.smarthome.password = "**********";
                        res.send({
                            success: true,
                            data: safeDevice
                        });

                    }).catch(function (err) {
                        res.send({
                            'err': err.message
                        });
                    });
            })

            $express.post("/api/1/validate", function (req, res) {
                $logger.debug("Validate request received...")
                var token = req.body.token;
                $controller.getDevice(token)
                    .then(function (device) {
                        if (device == null) {
                            res.send({
                                'err': "Invalid Token"
                            });
                            return;
                        }
                        res.send({ success: true });
                    }).catch(function (err) {
                        res.send({
                            'err': "Invalid Token"
                        });
                        return;
                    })
            })

        });
}