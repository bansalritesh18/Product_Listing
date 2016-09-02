var express = require("express");
var app = express();
var DB = require("./DB.js");
var captchapng = require('captchapng');
var bodyParser = require("body-parser");
var PORT = 5000;
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var Config = require("./Config");

app.use(session({
    secret: 'Product Listing Sample Key',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: "mongodb://" + Config.host + ":" + Config.port + "/" + Config.dbName
    })
}));

app.use(express.static(__dirname + "/public"));

DB.connectToDatabase().then(function () {
    configure();
}).catch(function (err) {
    console.log("Error in staring server : " + err);
});

function configure() {

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(function (req, res, next) {
        req.session.userInfo = req.session.userInfo || {};
        next()
    });


    app.get("/getData", function (req, res) {
        if (!req.session.userInfo.isUserVerified) {
            writeResponse(new Error("User is not verified."), res);
            return;
        }
        var skip = typeof  req.query.skip === "string" ? parseInt(req.query.skip) : 0;
        var limit = typeof  req.query.limit === "string" ? parseInt(req.query.limit) : 20;
        var params = {skip: skip, limit: limit};

        return DB.find(params).then(function (dataToReturn) {
            writeResponse(dataToReturn, res);
        }).catch(function (err) {
            writeResponse(err, res);
        })
    });

    app.all("/verifyCaptcha", function (req, res) {
        var captcha = req.body.captcha;
        if (!captcha || captcha != req.session.userInfo.captcha) {
            writeResponse(new Error("Invalid captcha"), res);
        } else {
            req.session.userInfo.isUserVerified = true;
            writeResponse({isUserVerified: true}, res);
        }
    });

    app.all("/captcha", function (req, res) {
        var captcha = parseInt(Math.random() * 9000 + 1000);
        req.session.userInfo.captcha = captcha;
        var p = new captchapng(80, 30, captcha);
        p.color(211, 160, 145, 255);
        var img = p.getBase64();
        var imgbase64 = new Buffer(img, 'base64');
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(imgbase64);
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
