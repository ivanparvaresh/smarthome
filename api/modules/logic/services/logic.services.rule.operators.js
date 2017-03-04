module.exports = function (app) {

    app.factory("logic.services.rule.operators", [], function () {

        var _globalValues = [];
        var _operators = [];

        return {
            registerValue: function (value) {
                _globalValues.push(value);
            },
            getValue: function (name) {
                for (var i = 0; i < _globalValues.length; i++) {
                    if (_globalValues[i].name == name)
                        return _globalValues[i];
                }
                return null;
            },
            registerOperator: function (operator) { 
                _operators.push(operator);
            },
            getOperator:function(name){
                for (var i = 0; i < _operators.length; i++) {
                    if (_operators[i].name == name)
                        return _operators[i];
                }
                return null;
            },
        }

    })

}