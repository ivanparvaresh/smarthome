var bodyParser = require('body-parser');

module.exports = function (sarina) {
    sarina.config("api.feature.command",
        [
            "sarina.logger",
            "sarina.express.app",
            "logic.yonnet.services.api",
            "logic.services.controller"
        ],
        function ($logger, $express, $pai, $controller) {

            function handleError(res, err) {
                $logger.error(err);
                res.send(err);
            }

            $express.post("/api/1/command", function (req, res) {

                var token = req.body.token;
                var name = req.body.name;

                $logger.debug("Executing a command [" + name + "]");

                $controller.execCommand(token, name)
                    .then(function (result) {

                        res.send({ "success": true });

                    }).catch(function (err) { handleError(res, err); });
            });

        });
}