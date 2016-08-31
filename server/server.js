var express = require("express");
var app = express();
var DB = require("./DB.js");
var PORT = 5000;

DB.connectToDatabase().then(function () {
    configure();
});

function configure() {
    app.get("/", function (req, res) {
        var skip = typeof  req.query.skip === "string" ? parseInt(req.query.skip) : 0;
        var limit = typeof  req.query.limit === "string" ? parseInt(req.query.limit) : 20;

        var params = {skip: skip, limit: limit};

        return DB.find(params).then(function (dataToReturn) {
            writeResponse(dataToReturn, res);
        }).catch(function (err) {
            writeResponse(err, res);
        })
    });

    app.listen(PORT, function () {
        console.log("server started on port : " + PORT);
    });
}


function writeResponse(result, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    if (result instanceof Error) {
        res.send(JSON.stringify({status: "error", error: {message: result.message}}));
    } else {
        res.send(JSON.stringify({status: "OK", data: result}));
    }
}
