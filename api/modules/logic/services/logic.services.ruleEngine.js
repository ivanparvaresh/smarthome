module.exports = function (app) {

    app.service("logic.services.ruleEngine", ["sarina.logger"], function ($logger) {
        return {
            check: function (claims, rules) {


                var me = this;
                return new Promise(function (resolve, reject) {

                    for (var i = 0; i < rules.length; i++) {

                        var rule = rules[i];
                        var type = rule.name.split(":")[0];

                        var ruleName = rule.name.replace(type + ":", "");
                        var origValue = "";

                        switch (type) {
                            case "DEVICE":
                                origValue = claims[ruleName];
                                break;
                            case "GLOBAL":
                                origValue = me.getGlobalValue(ruleName);
                        };

                        var ruleResult = true;
                        switch (rule.op) {

                            case "==":
                                if (rule.value != origValue)
                                    ruleResult = false;
                                break;
                            case "!=":
                                if (rule.value == origValue)
                                    ruleResult = false;
                                break;

                            case ">":
                                if (parseInt(origValue) <= parseInt(rule.value))
                                    ruleResult = false;
                                break;
                            case ">=":
                                if (parseInt(origValue) < parseInt(rule.value))
                                    ruleResult = false;
                                break;
                            case "<":
                                if (parseInt(origValue) >= parseInt(rule.value))
                                    ruleResult = false;
                                break;
                            case "<=":
                                if (parseInt(origValue) > parseInt(rule.value))
                                    ruleResult = false;
                                break;
                        }

                        $logger.debug("\tRULE:CHECK > ["+ruleResult+"] " + ruleName + "," + origValue + rule.op + rule.value);

                        if (!ruleResult) {
                            resolve(false);
                            return;
                        }
                    }

                    resolve(true);

                })
            },
            getGlobalValue: function (name) {
                switch (name) {
                    case "TIME:CURRENT":
                        {
                            var dt = new Date();
                            return dt.getHours() + "" + dt.getMinutes();
                        }
                        break;
                }
            }
        }
    });

}