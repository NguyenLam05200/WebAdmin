const {
    db
} = require('../utils/db');
const {
    ObjectId
} = require('mongodb');

var mongoose = require("mongoose");

var schemaProduct = new mongoose.Schema({
    Name: String,
    Image: String,
    Price: Number,
    Detail: String
});

module.exports = {
    all: async () => {
        const proCollection = db().collection('Product');
        const list = await proCollection.find({}).toArray();
        //console.dir(list);
        return list;
    },
}