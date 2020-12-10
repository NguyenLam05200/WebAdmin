const {
    db
} = require('../utils/db');
const {
    ObjectId
} = require('mongodb');

const mongoose = require("mongoose");

const nameCollection = 'Categories';

const schemaCategory = new mongoose.Schema({
    name: String
});

// compile schema to model
const Category = mongoose.model(nameCollection, schemaCategory);

//code cứng khi database k có collection Categories



module.exports = {
    getAll: async () => {
        //code cứng:
        const list = [{
                _id: '5fce7d0d6e1a34e6da669e6e',
                name: 'Men'
            },
            {
                _id: '5fce7d246e1a34e6da669e6f',
                name: 'Women'
            }
        ];
        return list;
    },
    getOne: async (id) => {
        const catCollection = db().collection(nameCollection);
        const one = await catCollection.findOne({
            _id: ObjectId(id)
        })
        return one;
    },
    addOne: async (data) => {
        var newCat = new Category({
            name: data.CatName
        });
        //console.log(newCat);
        const catCollection = db().collection(nameCollection);
        return await catCollection.insertOne(newCat);
    },
    patchOne: async (data) => {
        const catCollection = db().collection(nameCollection);
        return await catCollection.updateOne({
            "_id": ObjectId(data._id)
        }, {
            $set: {
                "name": data.name
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