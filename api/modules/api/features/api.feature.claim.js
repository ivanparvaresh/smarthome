var bodyParser = require('body-parser');

module.exports = function (sarina) {
    sarina.config("api.feature.claim",
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

            $express.post("/api/1/claims/update", function (req, res) {

                $logger.debug("Claimg set request received...");

                var token = req.body.token;
                var claims = req.body.claims;
                $controller.updateClaims(token, claims)
                    .then(function (result) {
                        res.send(result);
                    }).catch(function (err) { handleError(res, err); });

            })
        });
}