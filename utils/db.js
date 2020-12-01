const { MongoClient } = require("mongodb");

const uri = 'mongodb+srv://shoesStore:SiL0PDyzkVB1B0O4@cluster0.edx0y.mongodb.net/ShoesStore?retryWrites=true&w=majority';
// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true });

let database;

async function connectDb(){
    await client.connect();
    // Establish and verify connection
    database = await client.db("ShoesStore");
    console.log('Db connected!');
}

console.log('RUNNING DB...');

connectDb();

const db = () => database;

module.exports.db = db;