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
    imgName: String,
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
            imgName: data.imgName,
            price: data.price,
            salePrice: data.salePrice,
            category: data.selectCat,
            details: data.details
        });
        //console.log(newPro);
        const catCollection = db().collection(nameCollection);
        return await catCollection.insertOne(newPro);
    },
    getOne: async (id) => {
        const catCollection = db().collection(nameCollection);
        const one = await catCollection.findOne({
            _id: ObjectId(id)
        })
        return one;
    },
    patchOne: async (data) => {
        const catCollection = db().collection(nameCollection);
        return await catCollection.updateOne({
            "_id": ObjectId(data._id)
        }, {
            $set: {
            "imgName": data.imgName,
            "price": data.price,
            "salePrice": data.salePrice,
            "category": data.selectCat,
            "details": data.details
            }
        });
    },
    delOne: async (data) => {
        const catCollection = db().collection(nameCollection);
        var result = null;
        try {
            result = await catCollection.deleteOne({
                "_id": ObjectId(data._id)
            });
        } catch (e) {
            console.log(e);
        }
        return result;
    }
}