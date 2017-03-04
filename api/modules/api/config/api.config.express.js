var bodyParser = require('body-parser');

module.exports = function (sarina) {
    sarina.config("api.config.express",
        ["sarina.express.app"],
        function ($app) {

            $app.use(bodyParser.json()); // support json encoded bodies
            $app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

            $app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
                res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
                next();
            });

        });
}