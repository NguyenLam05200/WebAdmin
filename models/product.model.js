const {
    db
} = require('../utils/db');
const {
    ObjectId
} = require('mongodb');
const nameCollection = "Products";

var mongoose = require("mongoose");

var schemaProduct = new mongoose.Schema({
    name: String,
    price: Number,
    category: ObjectId,
    tinyDes: String, //mo ta so luoc sp
    details: String
});


// compile schema to model
const Product = mongoose.model(nameCollection, schemaProduct);

module.exports = {
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
    addOne: async (data) => {
        var newPro = new Product({
            name: data.name,
            price: data.price,
            category: ObjectId(data.selectCat),
            tinyDes: data.tinyDes, //mo ta so luoc sp
            details: data.details
        });
        console.log(newPro);
        const catCollection = db().collection(nameCollection);
        return await catCollection.insertOne(newPro);
    }
}