var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var db = undefined;
var Config = require("./Config");
var Q = require("q");

var table = "products";
//mongoimport --db productListingSample --collection products --type json --file data.json --jsonArray


exports.connectToDatabase = function () {
    if (db) {
        var d = Q.defer();
        d.resolve(db);
        return d.promise;
    }
    var url = "mongodb://" + Config.host + ":" + Config.port + "/" + Config.dbName;
    return connectToMongo(url).then(function (dbInstance) {
        db = dbInstance;
        return db;
    })
}

function connectToMongo(url) {
    var d = Q.defer();
    MongoClient.connect(url, function (err, db) {
        if (err) {
            d.reject(err);
            return;
        }
        d.resolve(db);

    });
    return d.promise;
}


exports.find = function (options) {
    var d = Q.defer();
    options = options || {};
    db.collection(table).find({}, options).toArray(function (err, result) {
        if (err) {
            d.reject(err);
            return;
        }
        d.resolve(result);
    });
    return d.promise;
}


