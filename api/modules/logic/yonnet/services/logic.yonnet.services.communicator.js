module.exports = function (app) {
    app.factory("logic.yonnet.services.communicator",
        [
            "sarina.logger",
            "logic.yonnet.services.net",
            "sarina.event",
            "logic.yonnet.services.parser"
        ],
        function ($logger, $net, $event, $parser) {

            class communicator {

                get isOpen() {
                    return this._isOpen;
                }
                get isOpening() {
                    return this._isOpening;
                }

                constructor(name, ip, port) {

                    this._name = name;
                    this._ip = ip;
                    this._port = port;

                    this._socket = new $net.Socket();

                    this._isOpen = false;
                    this._isOpening = false;
                }


                open() {

                    var me = this;
                    return new Promise(function (resolve, reject) {

                        if (me._isOpen || me._isOpening) {
                            reject(new Error("Invalid State"));
                            return;
                        }

                        me._isOpening = true;
                        $logger.debug("Establishing connection to the server " + me._name + " '" + me._ip + ":" + me._port + "'");
                        me.client = me._socket.connect(me._port, me._ip, function () {
                            $logger.debug("Connection to [" + me._name + "] established succesfully");
                            $event.publish("CONNECTION:" + me._name + ":ESTABLISHED");
                            me._isOpen = true;
                            me._isOpening = false;
                            resolve();
                            me.startReceiving();
                        });

                        me.client.on('end', function () {
                            me._isOpen = false;
                            me._isOpening = false;
                            $logger.debug("Connection to [" + me._name + "] closed");
                            $event.publish("CONNECTION:" + me._name + ":CLOSED");
                        });
                        me.client.on('error', function (err) {
                            me._isOpen = false;
                            me._isOpening = false;
                            $logger.error("An error occured while connecting to [" + me._name + "]:", err);
                            $event.publish("CONNECTION:" + me._name + ":CLOSED");
                        })
                    })
                }

                close() {
                    var me = this;
                    return new Promise(function (resolve, reject) {
                        if (!me._isOpen) reject("No Connection to close exists");
                        $logger.debug("Connection to [" + me._name + "] closed");
                        me._socket.destroy();
                        me._isOpen=false;
                        me._isOpening=false;
                        resolve();
                    });
                }


                send(data, options) {
                    var me = this;
                    return new Promise(function (resolve, reject) {

                        if (!me._isOpen && me._isOpening) {
                            reject("Invalid State!!");
                            return;
                        }

                        var msg = "INTYON;START_INTYON;" + data + ";END_INTYON;";
                        $logger.debug("[" + me._name + "] Sending:", msg);
                        me._socket.write(msg);
                        resolve();
                    });
                }
                startReceiving() {
                    var me = this;
                    this._socket.on("data", function (data) {
                        $logger.debug("[" + me._name + "] Received:", data.toString());
                        $event.publish("MESSAGE:" + me._name + ":DATA", data.toString());

                        var message =
                            $parser.process(data.toString());
                        if (message != null) {
                            $event.publish("MESSAGE:" + me._name + ":PROCESSED:DATA", message);
                            $logger.debug("[" + me._name + "] Message Resolved:", JSON.stringify(message));
                        }

                    })
                }
            }
            return {
                create: function ($name, $ip, $port) {
                    return new communicator($name, $ip, $port);
                }
            }

        });
}