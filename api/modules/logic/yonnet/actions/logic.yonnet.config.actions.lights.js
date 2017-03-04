module.exports = function (app) {

    app.config("logic.yonnet.config.actions.lights", ["logic.services.actions"], function (actions) {

        actions.register({
            name: "/light/on/location",
            title: "switch on location lighst",
            exec: function (device, params) {
                return device.$api.switchLocationControlOn(params.location_id);
            }
        });

        actions.register({
            name: "/light/off/location",
            title: "switch off location lights",
            exec: function (device, params) {
                return device.$api.switchLocationControlOff(params.location_id);
            }
        });

        actions.register({
            name: "/light/off/control",
            title: "switch off light",
            exec: function (device, params) {
                return device.$api.switchControlOff(params.location_id, params.control_id);
            }
        });

        actions.register({
            name: "/light/on/control",
            title: "switch on light",
            exec: function (device, params) {
                return device.$api.switchControlOn(params.location_id, params.control_id);
            }
        });


    })

}