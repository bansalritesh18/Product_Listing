var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var db = undefined;
var Q = require("q");
var host = "127.0.0.1";
var port = "27017";
var dbName = "productListingSample";

var table = "products";
//mongoimport --db productListingSample --collection products --type json --file data.json --jsonArray

exports.connectToDatabase = function () {
    if (db) {
        var d = Q.defer();
        d.resolve(db);
        return d.promise;
    }
    var url = "mongodb://" + host + ":" + port + "/" + dbName;
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


