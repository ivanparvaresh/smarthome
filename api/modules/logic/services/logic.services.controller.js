module.exports = function (app) {

    app.factory("logic.services.controller",
        [
            "sarina.logger",
            "logic.services.device",
            "logic.services.actions",
            "logic.services.rule.operators",
        ],
        function ($logger, $device, $actions, $operators) {

            return {

                _runTriggers: function (device, claims) {
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
                            $logger.debug("\t" + trigger.name);
                            (function (trigger) {

                                var ruleFailed = false;
                                for (var j = 0; j < trigger.rules.length; j++) {
                                    var rule = trigger.rules[j];
                                    $logger.debug("\t\t Running Rule:" + rule.name);
                                    var value = device.claims[rule.name];

                                    if (value == null) {
                                        var operator =
                                            $operators.getValue(rule.name);
                                        if (operator != null) {
                                            value = operator.exec(device);
                                        }
                                    }else{
                                        $logger.debug("\t\t\t Using Device Claims",value);
                                    }

                                    if (value == null) {
                                        if (claims != null) {
                                            value = claims[rule.name];
                                        }
                                    }


                                    var operator =
                                        $operators.getOperator(rule.op);
                                    if (operator == null) {
                                        $logger.debug("\t\t Rule operator '" + rule.op + "' not found");
                                        ruleFailed = true;
                                        break;
                                    }

                                    if (!operator.exec(value, rule.value)) {
                                        $logger.debug("\t\t\t REJECTED [" + value + " " + rule.op + " " + rule.value + "]");
                                        ruleFailed = true;
                                        break;
                                    } else {
                                        $logger.debug("\t\t\t ACCEPTED [" + value + " " + rule.op + " " + rule.value + "]");
                                    }
                                }
                                if (!ruleFailed) {
                                    $logger.debug("\t\t Trigger Accepted, Running Actions:");
                                    for (var a = 0; a < trigger.actions.length; a++) {
                                        var action = trigger.actions[a];
                                        $logger.debug("\t\t\t Action [" + action.name + "]");
                                        progress++;
                                        me._execAction(device, action.name, action.data)
                                            .then(onCompleted).catch(onCompleted);
                                    }
                                } else {
                                    progress++;
                                    onCompleted();
                                    $logger.debug("\t\t Rule Rejected");
                                }

                            })(trigger)
                        }
                    })
                },
                _execAction: function (device, name, params) {

                    $logger.debug("Executing action '" + name + "'", JSON.stringify(params));
                    return new Promise(function (resolve, reject) {

                        var action = $actions.get(name);
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
                getDevices: function () {
                    return new Promise(function (resolve, reject) {
                        resolve($device.getDevices());
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

                //////////////////////////////////////////
                //  CLAIMS
                //////////////////////////////////////////
                updateClaims: function (token, claims) {

                    var me = this;
                    return new Promise(function (resolve, reject) {

                        var device = $device.findDeviceByToken(token);
                        if (device == null) {
                            reject(new Error('Token is invalid'));
                            return;
                        }

                        if (device.claims == null)
                            device.claims = [];

                        $logger.debug("\t device : " + device.name);
                        for (var j = 0; j < claims.length; j++) {
                            $logger.debug("\t [" + j + "] " + claims[j].name + " = " + claims[j].value);
                            device.claims[claims[j].name] = claims[j].value;
                        }
                        me._runTriggers(device, { '/executer': 'update_claim' }).then(resolve).catch(reject);
                    });

                },
                runTriggers: function (device) {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        me._runTriggers(device, { '/executer': 'schedule' }).then(resolve).catch(reject);
                    })
                }
            }
        })
}