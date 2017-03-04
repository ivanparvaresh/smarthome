module.exports = function (app) {
    app.service("logic.yonnet.services.api",
        [
            "sarina.logger",
            "sarina.event",
            "logic.yonnet.services.communicator",
            "logic.yonnet.services.protocol"
        ],
        function ($logger, $event, $communicator, $protocol) {

            class Api {

                constructor($protocol, username, password) {
                    this._username = username;
                    this._password = password;
                    this._$protocol = $protocol;
                    this._loggedIn = false;
                }

                login() {
                    return this._$protocol
                        .create()
                        .request("4", this._username, this._password)
                        .allowAnonymous()
                        .response("5")
                        .exec();
                }
                getLocations() {
                    return this._$protocol
                        .create()
                        .request("6", "1")
                        .response("6", function (data) {
                            return data.result.location;
                        })
                        .exec();
                }
                getControls() {
                    return this._$protocol
                        .create()
                        .request("6", "2")
                        .response("6", function (data) {
                            return data.result.control;
                        })
                        .exec();
                }

                ///////////////////////////////////////////
                // CONTROLS
                ///////////////////////////////////////////
                switchLocationControlOff(locationId) {
                    return this._$protocol
                        .create()
                        .request("15", locationId)
                        .exec();
                }
                switchLocationControlOn(locationId) {
                    return this._$protocol
                        .create()
                        .request("16", locationId)
                        .exec();
                }
                switchControlOff(locationId, controlId) {
                    return this._$protocol
                        .create()
                        .request("8", controlId, 2, 0)
                        .exec();
                }
                switchControlOn(locationId, controlId) {
                    return this._$protocol
                        .create()
                        .request("8", controlId, 1, 0)
                        .exec();
                }



            };
            class Transporter {

                constructor(name, ip, port) {
                    this._name = name;
                    this._$communicator = $communicator.create(name, ip, port);
                    this._isLogin = false;
                    this._queue = [];
                    this._isProcessing = false;

                    $event.on("CONNECTION:" + name + ":CLOSED", function () {
                        $logger.debug("Communicator closed, so we reset transporter, but keep commands in queue");
                        this._isLogin = false;
                    });

                }

                _checkConnection() {
                    var me = this;
                    return new Promise(function (resolve, reject) {

                        if (!me._$communicator.isOpen) {

                            if (me._$communicator.isOpenning) {
                                return;
                            }

                            me._$communicator.open().then(function () {

                            }).catch(reject);
                            return;
                        }

                        resolve();
                    });
                }
                processQueue() {
                    try {

                        var me = this;

                        if (me._isProcessing) {
                            $logger.debug("Transporter is busy ...")
                            return;
                        }

                        if (me._queue.length == 0) {
                            $logger.debug("No record to process in queye");
                            return;
                        }

                        if (!me._$communicator.isOpen) {
                            me._isLogin = false;
                            if (!me._$communicator.isOpening) {
                                $logger.debug("Connection is not ready,so lets open a new connection...");
                                me._$communicator.open()
                                    .then(function () {
                                        me.processQueue();
                                        return;
                                    });
                            }
                            return;
                        }


                        
                        for (var i = 0; i < me._queue.length; i++) {
                            var request = me._queue[i];
                            if (!me._isLogin && !request.allowAnonymous) {
                                continue;
                            }
                            me._isProcessing = true;
                            me._$communicator.send(request.data)
                                .then(function (data) {
                                    request.resolve(data);
                                    me._queue.splice(i, 1);
                                    me._isProcessing = false;
                                    me.processQueue();
                                })
                                .catch(function (err) {
                                    request.reject(err);
                                    me._queue.splice(i, 1);
                                    me._isProcessing = false;
                                    me.processQueue();
                                });
                            break;
                        }
                    }
                    catch (err) {
                        $logger.error("An error occured during processeing", err)
                    }
                } // end of _process queue

                send(request) {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        $logger.debug("Pushing message to queue:", request.data);
                        me._queue.push({
                            allowAnonymous: request.allowAnonymous,
                            data: request.data,
                            resolve: resolve,
                            reject: reject
                        });
                        me.processQueue();
                    });
                }

            }




            return {
                create: function ($device) {
                    return new Promise(function (resolve, reject) {

                        var transporter = new Transporter($device.name, $device.smarthome.ip, $device.smarthome.port);
                        var protocol = $protocol.create($device.name, transporter);

                        var apiService = new Api(
                            protocol,
                            $device.smarthome.username,
                            $device.smarthome.password
                        );

                        $event.on("CONNECTION:" + $device.name + ":ESTABLISHED", function () {
                            $logger.debug("Trying to signin into server");
                            return new Promise(function (resolve, reject) {
                                $device.$api.login().then(function (result) {

                                    if (result) {
                                        $logger.debug("Succesfully authentication");
                                        transporter._isLogin = true;
                                        transporter.processQueue();
                                    } else {
                                        $logger.error("Invalid credential!!");
                                    }

                                }).catch(reject);
                            })
                        });

                        resolve(apiService);

                    })
                }
            }
        });

}

