var fs = require("fs");
module.exports = function (app) {

    app.factory("logic.services.device", ["options", "sarina.logger", "logic.yonnet.services.api"], function (options, $logger, $api) {

        class DeviceController {

            constructor() {
                this._devices = [];
                this._dataPath = options.process.pwd + "/data";

                this._initiate();
            }


            _initiate() {
                $logger.debug("Loading devices list ['" + this._dataPath + "']");
                var files = fs.readdirSync(this._dataPath);
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    try {
                        var device = require(this._dataPath + "/" + file);
                        this.initateDevice(device);
                    } catch (err) {
                        $logger.error(err.message);
                    }
                }

            }
            _saveDeviceData(device) {
                fs.writeFileSync(this._dataPath + "/" + device.id + ".json", JSON.stringify(device.$config));
            }


            initateDevice(deviceConfig) {
                var cloneDevice = JSON.parse(JSON.stringify(deviceConfig));
                cloneDevice.claims = [];
                cloneDevice.$config = deviceConfig;

                var me = this;
                $api.create(cloneDevice).then(function ($apiService) {

                    cloneDevice.$api = $apiService;
                    me._devices.push(cloneDevice);

                    if (cloneDevice.$config.locations == null || cloneDevice.$config.lights == null) {
                        $logger.debug("Updating device local informaction...")
                        me.refreshDevice(cloneDevice).then(function () {
                            $logger.debug("Device information update succesfully");
                        }).catch(function (err) {
                            $logger.error("An error occured while updating device information", err);
                        })
                    }
                    $logger.debug("Device [" + deviceConfig.name + "] initiated succesfully");
                }).catch(function (err) {
                    $logger.error("Error on creating api service for device [" + deviceConfig.name + "]", err);
                })

            }

            refreshDevice(device) {
                $logger.debug("Refreshing device [" + device.name + "] info...");
                var me = this;
                return new Promise(function (resolve, reject) {
                    device.$api.getLocations().then(function (locations) {
                        device.$config.locations = locations;
                        device.$api.getControls().then(function (controls) {
                            device.$config.lights = controls;
                            me._saveDeviceData(device);
                            resolve(reject);
                        }).catch(reject);
                    }).catch(reject);
                })

            }


            findDeviceByName(name) {
                for (var i = 0; i < this._devices.length; i++) {
                    if (this._devices[i].name == name)
                        return this._devices[i];
                }
            }
            findDeviceByToken(token) {

                for (var i = 0; i < this._devices.length; i++) {
                    if (this._devices[i].token == token)
                        return this._devices[i];
                }
            }
            findDeviceByUsername(username) {
                for (var i = 0; i < this._devices.length; i++) {
                    if (this._devices[i].username == username)
                        return this._devices[i];
                }
            }

        }

        return new DeviceController();
    })

}