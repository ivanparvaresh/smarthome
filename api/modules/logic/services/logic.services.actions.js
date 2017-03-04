module.exports = function (app) {

    app.factory("logic.services.actions", [], function () {
        var _actions = [];

        return {
            register: function (action) {
                _actions.push(action);
            },
            get: function (name) {
                for (var i = 0; i < _actions.length; i++) {
                    if (_actions[i].name == name)
                        return _actions[i];
                }
                return null;
            }
        }

    })

}