module.exports = function (app) {
    app.service("logic.yonnet.services.protocol",
        [
            'sarina.event'
        ],
        function ($event) {

            ///////////////////
            // COMMAND CONFIG
            ///////////////////
            class CommandConfig {


                constructor(name, $transporter) {
                    this._name = name;
                    this._$transporter = $transporter;
                }

                request(commandCode) {

                    this._request = {
                        commandCode: commandCode,
                        data: '',
                        allowAnonymous: false
                    }

                    if (arguments.length == 1) {
                        this._request.data = commandCode + ";1;1";
                        return this;
                    }

                    var parameters = [];
                    if (Array.isArray(arguments[1])) {
                        for (var i = 0; i < arguments[1].length; i++) {
                            parameters.push(arguments[1][i]);
                        }
                    } else {

                        for (var i = 1; i < arguments.length; i++) {
                            parameters.push(arguments[i]);
                        }
                    }

                    var len = 0;
                    var data = "";

                    for (var i = 0; i < parameters.length; i++) {
                        data += parameters[i] + ";";
                        len += (parameters[i]).toString().length;
                    }
                    this._request.data = commandCode + ';' + len + ";" + data + len;
                    return this;
                }

                response(commandCode, processFunc) {
                    this._response = {
                        commandCode: commandCode,
                        processFunc: processFunc
                    };
                    return this;
                }
                allowAnonymous() {
                    this._request.allowAnonymous = true;
                    return this;
                }

                exec() {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        if (me._request) {
                            me._send()
                                .then(function () {
                                    if (me._response) {
                                        me._receive(resolve);
                                    } else {
                                        resolve();
                                    }
                                })
                                .catch(reject);
                        } else {
                            if (me._response) {
                                me._receive(resolve);
                            }
                        }
                    })
                }
                getCommand() {
                    return this.request.data;
                }

                _send() {
                    return this._$transporter.send(this._request);
                }
                _receive(resolve) {
                    var me = this;
                    var handler = function (message) {
                        if (message.commandCode == me._response.commandCode) {
                            $event.remove("MESSAGE:" + me._name + ":PROCESSED:DATA", handler);
                            var result = message.result;
                            if (me._response.processFunc) {
                                result = me._response.processFunc(message);
                            }

                            resolve(result);
                        }
                    }
                    $event.on("MESSAGE:" + me._name + ":PROCESSED:DATA", handler);
                }
            }

            ///////////////////
            // SERVICE SCHEMA
            ///////////////////
            return {

                create: function ($name, $transporter) {
                    var protocol = {
                        create: function () {
                            return new CommandConfig($name, $transporter);
                        }
                    }
                    protocol._$transporter=$transporter;
                    return protocol;
                },

            }
        });
}