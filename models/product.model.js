const {
    db
} = require('../utils/db');
const {
    ObjectId
} = require('mongodb');
const nameCollection = "Products";

var mongoose = require("mongoose");

var schemaProduct = new mongoose.Schema({
    _id: ObjectId,
    name: String,
    price: Number,
    salePrice: Number,
    category: String,
    details: String
});


// compile schema to model
const Product = mongoose.model(nameCollection, schemaProduct);

module.exports = {
    ObjectId,
    all: async () => {
        const proCollection = db().collection(nameCollection);
        const list = await proCollection.find({}).toArray();
        //console.dir(list);
        return list;
    },
    allByCat: async (catName) => {
        const proCollection = db().collection(nameCollection);
        const list = await proCollection.find({
            "category": catName
        }).toArray();
        //console.log(list);
        return list;
    },
    addOne: async (data, _id) => {
        console.log("---" +_id);
        var newPro = new Product({
            _id: _id,
            name: data.name,
            price: data.price,
            salePrice: data.salePrice,
            category: data.selectCat,
            details: data.details
        });
        //console.log(newPro);
        const catCollection = db().collection(nameCollection);
        return await catCollection.insertOne(newPro);
    }
}