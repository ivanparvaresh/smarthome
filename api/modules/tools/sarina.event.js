module.exports = function (app) {

    app.factory("sarina.event", function () {
        var subscribers = [];
        return {
            on: function (on, func) {
                if (subscribers[on] == null) {
                    subscribers[on] = [];
                }
                subscribers[on].push(func);
            },
            remove: function (on, func) {
                if (subscribers[on] == null) return;
                if (subscribers[on].indexOf(func) != -1) {
                    subscribers[on].splice(subscribers[on].indexOf(func), 1);
                }
            },
            publish: function (on, args) {
                return new Promise(function (resolve, reject) {
                    if (subscribers[on] == null) resolve();

                    var progress = 0;
                    function onCompleted() {
                        if (progress <= 0)
                            resolve();
                    }

                    if (subscribers[on] == null) {
                        resolve();
                        return;
                    }

                    for (var i = 0; i < subscribers[on].length; i++) {
                        var result = subscribers[on][i](args);
                        if (result != null && result.then) {
                            progress++;
                            result.then(onCompleted).catch(onCompleted);
                        }
                    }
                })
            }
        }
    });
}