module.exports = function (app) {

    app.factory("logic.services.controller",
        [
            "sarina.logger",
            "logic.services.device",
            "logic.services.actions",
            "logic.services.ruleEngine",
        ],
        function ($logger, $device, $actions, $rule) {

            return {

                _runTrigger: function (device) {
                    var me = this;
                    return new Promise(function (resolve, reject) {

                        var progress = 0;
                        function onCompleted() {
                            progress--;
                            if (progress <= 0) {
                                resolve();
                            }
                        }

                        $logger.debug("Running Triggers:")
                        for (var i = 0; i < device.triggers.length; i++) {
                            var trigger = device.triggers[i];
                            progress++;
                            (function (trigger) {
                                $rule.check(device.claims, trigger.rules)
                                    .then(function (result) {
                                        if (result) {
                                            $logger.debug("\t[" + trigger.name + "] ACCEPTED");
                                            me._execAction(device, trigger.action, trigger.data)
                                                .then(onCompleted).catch(onCompleted);
                                        }
                                        else
                                            $logger.debug("\t[" + trigger.name + "] REJECTED");
                                    }).catch(function (err) {
                                        $logger.debug("\t[" + trigger.name + "] Faield", err);
                                        onCompleted();
                                    });

                            })(trigger);
                        }
                    })
                },
                _execAction: function (device, name, params) {

                    $logger.debug("Executing action '" + name + "'", JSON.stringify(params));
                    return new Promise(function (resolve, reject) {

                        var action = $actions.getAction(name);
                        if (action == null) {
                            reject(new Error("Action [" + name + "] not founc"));
                            return;
                        }
                        action.exec(device, params)
                            .then(resolve, reject);
                    });

                },

                //////////////////////////////////////////
                //  GLOBAL Methods
                //////////////////////////////////////////
                findTokenByUsernameAndPassword: function (username, password) {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        var device = $device.findDeviceByUsername(username);
                        if (device != null && device.password == password) {
                            resolve(device);
                            return;
                        }

                        reject(new Error("Token not found"));
                    })
                },

                getDevice: function (token) {
                    return new Promise(function (resolve, reject) {
                        var device = $device.findDeviceByToken(token);
                        if (device == null) {
                            reject(new Error('Token is invalid'));
                            return;
                        }
                        resolve(device.$config);
                    })
                },

                reloadData: function (token) {
                    return new Promise(function (resolve, reject) {
                        var device = $device.findDeviceByToken(token);
                        if (device == null) {
                            reject(new Error('Token is invalid'));
                            return;
                        }
                        $device.refreshDevice(device).then(resolve).catch(reject);
                    });
                },


                //////////////////////////////////////////
                //  COMMANDS
                //////////////////////////////////////////
                execCommand: function (token, name) {
                    var me = this;
                    return new Promise(function (resolve, reject) {

                        var device = $device.findDeviceByToken(token);
                        if (device == null) {
                            reject(new Error('Token is invalid'));
                            return;
                        }

                        var progress = 0;
                        function onActionCompleted() {
                            progress--;
                            if (progress <= 0) {
                                resolve();
                            }
                        }
                        for (var i = 0; i < device.commands.length; i++) {
                            var command = device.commands[i];
                            if (command.name == name) {
                                for (var j = 0; j < command.actions.length; j++) {

                                    var action = command.actions[j];
                                    progress++;

                                    me._execAction(device, action.name, action.data)
                                        .then(onActionCompleted)
                                        .catch(onActionCompleted);
                                }
                            }
                        }

                    });
                },

                // CLAIMS
                updateClaims: function (token, claims) {

                    var me = this;
                    return new Promise(function (resolve, reject) {

                        var device = $device.findDeviceByToken(token);
                        if (device == null) {
                            reject(new Error('Token is invalid'));
                            return;
                        }

                        if (device.claims==null)
                            device.claims=[];

                        $logger.debug("\t device : " + device.name);
                        for (var j = 0; j < claims.length; j++) {
                            $logger.debug("\t [" + j + "] " + claims[j].name + " = " + claims[j].value);
                            device.claims[claims[j].name] = claims[j].value;
                        }
                        resolve(true);
                        //me.runTrigger(device).then(resolve).catch(reject);
                    });

                },

                // CONTROLLING LIGHTS
                setAllLightsStatus: function (token, status) {
                    var me = this;
                    return new Promise(function (resolve, reject) {

                        var device = $device.findDeviceByToken(token);
                        if (device == null) {
                            reject(new Error('Token is invalid'));
                            return;
                        }


                        var progress = 0;
                        function onCompleted() {
                            progress--;
                            if (progress <= 0) {
                                resolve();
                            }
                        }

                        for (var i = 0; i < device.locations.length; i++) {
                            progress++;
                            var location = device.locations[i];

                            if (status) {
                                device.$api.turnAllLightsOn(location.id)
                                    .then(onCompleted).catch(onCompleted);
                            } else {
                                device.$api.turnAllLightsOff(location.id)
                                    .then(onCompleted).catch(onCompleted);
                            }
                        }

                    }); // end of promise
                },

            }
        })

}