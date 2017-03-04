// module.exports = function (app) {

//     app.factory("logic.service.scheduler", [
//         "sarina.logger",
//         "options",
//         "logic.services.device",
//         "logic.services.controller",

//     ], function ($logger, options, $device, $controller) {

//         return {
//             interval: null,
//             tick: function () {
//                 var devices = $device._devices;
//                 $logger.debug("SCHEDULE IS RUNNING");
//                 for (var i = 0; i < devices.length; i++) {
//                     (function (device) {
//                         $controller.runTriggers(device)
//                             .then(function () {
//                                 $logger.debug("SCHEDULE Completed to execute for device [" + device.name + "]");
//                             })
//                     })(devices[i]);

//                 };
//             },
//             start: function () {
//                 var me = this;
//                 this.interval = setInterval(function () {
//                     me.tick();
//                 }, options.scheduler.interval)
//                 me.tick();
//             },
//             stop: function () {
//                 window.clearInterval(this.interval);
//             }
//         }



//     });

// }