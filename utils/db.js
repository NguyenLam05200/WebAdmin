const { MongoClient } = require("mongodb");
const dbName = "BaggageDB";
const uri = 'mongodb+srv://BaggageDB:rcBHKNQw7xcTBtL3@cluster0.edx0y.mongodb.net/' + dbName + '?retryWrites=true&w=majority';
// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true });

let database;

async function connectDb(){
    await client.connect();
    // Establish and verify connection
    database = await client.db(dbName);
    console.log('Db connected!');
}

console.log('RUNNING DB...');

connectDb();

const db = () => database;

module.exports.db = db;