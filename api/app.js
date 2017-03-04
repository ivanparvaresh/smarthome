var sarina = require('sarina');
var config = require("./config.json");
var sarinaexpress = require("sarina.express");


console.log("");
console.log("");
console.log("");
console.log("Welcome to My Smart Home");
console.log("==========================");
console.log("");
console.log("\t", "Version", sarina.info.version);
console.log("\t", "My Home", 2016);
console.log("");
console.log("=================");
console.log("");


config.process = { pwd: __dirname };

var app =
    sarina.create(config);

// log modules
app.module(sarinaexpress);
app.loadModules("./modules");

app.exec("App.exec", [
    "options",
    "sarina.express.server",
], function (options, $server, $scheduler) {
    return {
        run: function (resolve, reject) {
            $server.start(options.api.port).then(resolve).catch(reject);
        }
    }
})

app.start();