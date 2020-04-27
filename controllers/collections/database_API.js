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

    //tries to update item/s, if there's none it inserts instead
    updateElseInsertDocument: async function(query, newValues, collection){
        await MongoClient.connect(url, { useUnifiedTopology: true },function(err, db) {
            if (err) throw err;
            let dbo = db.db("museum_analytics");
            //if we have a batch of items
            if(newValues.constructor === Array) {
                let update = newValues.map(newValue => ({
                    updateOne: {
                        filter: { [query] : newValue[query]},
                        update: newValue,
                        upsert: true
                    }
                }));
                dbo.collection(collection).bulkWrite(update)
                    .then((res) => { console.log(res.result.nModified + " documents inserted/updated"); })
                    .catch(e => {
                    console.log(e);
                });
            }
            //if not
            else{
                dbo.collection(collection).updateMany(query, newValues, { upsert: true },function(err, res) {
                    if (err) throw err;
                    console.log(res.result.n + " documents inserted/updated");
                    db.close();
                });

            }


        });
    }
}