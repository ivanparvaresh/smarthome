module.exports = function (app) {

    app.config("logic.rule.operators.config", ["logic.services.rule.operators"], function (operators) {

        operators.registerValue({
            "name": "/global/time/now/hour",
            exec: function () {
                return new Date().getHours()
            }
        })
        operators.registerValue({
            "name": "/global/time/now/min",
            exec: function () {
                return new Date().getMinutes()
            }
        })
        operators.registerValue({
            "name": "/global/time/now/sec",
            exec: function () {
                return new Date().getSeconds()
            }
        })
        operators.registerValue({
            "name": "/global/time/isNight",
            exec: function () {
                var hour = new Date().getHours();
                if (hour > 19 || hour < 8) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        operators.registerValue({
            "name": "/global/time/isDay",
            exec: function () {
                var hour = new Date().getHours();
                if (hour > 19 || hour < 8) {
                    return false;
                } else {
                    return true;
                }
            }
        });

        operators.registerOperator({
            "name": "==",
            exec: function (value, expectedValue) {
                if (value + "" != expectedValue + "")
                    return false;
                return true;
            }
        })
        operators.registerOperator({
            "name": "!=",
            exec: function (value, expectedValue) {
                if (value + "" == expectedValue + "")
                    return false;
                return true;
            }
        })
        operators.registerOperator({
            "name": ">",
            exec: function (value, expectedValue) {
                if (parseInt(value) <= parseInt(expectedValue))
                    return false;
                return true;
            }
        })
        operators.registerOperator({
            "name": ">=",
            exec: function (value, expectedValue) {
                if (parseInt(value) < parseInt(expectedValue))
                    return false;
                return true;
            }
        })
        operators.registerOperator({
            "name": "<",
            exec: function (value, expectedValue) {
                if (parseInt(value) >= parseInt(expectedValue))
                    return false;
                return true;
            }
        })
        operators.registerOperator({
            "name": "<=",
            exec: function (value, expectedValue) {
                if (parseInt(value) > parseInt(expectedValue))
                    return false;
                return true;
            }
        })

    })

}