let mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";


module.exports = {
    insertDocument: async function(document, collection) {
        await MongoClient.connect(url, {useUnifiedTopology : true}, function(err, db) {
            if (err) throw err;
            var dbo = db.db("museum_analytics");
            dbo.collection(collection).insertMany(document, function (err, res) {
                if (err) throw err;
                console.log("Documents inserted");
                dbo.collection(collection).createIndex({day_of_visit: 1}).then(r =>
                    dbo.collection(collection).createIndex({visitor_ID: 1}).then(r =>
                        db.close()));
                //db.close();
            })
        });
    },

    getDocument: function(query, collection){
        return new Promise(function(resolve, reject) {
            MongoClient.connect(url, {useUnifiedTopology: true}).then(function(db) {
                var dbo = db.db("museum_analytics");
                dbo.collection(collection).find(query).toArray().then(function(results)  {
                    resolve(results);
                });
            });
        });
    },

    updateDocument: async function(query, newValues, collection){
        await MongoClient.connect(url, { useUnifiedTopology: true },function(err, db) {
            if (err) throw err;
            var dbo = db.db("museum_analytics");
            dbo.collection(collection).updateOne(query, newValues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        });
    }
}