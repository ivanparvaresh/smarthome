module.exports = function (app) {
    app.service("logic.yonnet.services.net", function () {
        return require("net");
    });
}