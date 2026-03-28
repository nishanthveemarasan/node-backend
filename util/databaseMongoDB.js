const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect =  async(callback) => {
    try{
        const client = await MongoClient.connect("mongodb://root:secret@mongodb:27017/mydb?authSource=admin")
        if(client){
            console.log("Connected to MongoDB");
            _db = client.db();
            callback();
        }

    }catch(err){
        throw err;
    }
   
}

const getDB = () => {
    if(_db){
        return _db;
    }
    throw "No database found";
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;

