const {
    db
} = require('../utils/db');
const {
    ObjectId
} = require('mongodb');
const nameCollection = "Users";

var mongoose = require("mongoose");

var schemaUser = new mongoose.Schema({
    username: String,
    password_hash: String,
    name: String,
    email: String,
    dob: Date,
    permission: Number
});


// compile schema to model
const User = mongoose.model(nameCollection, schemaUser);

module.exports = {
    ObjectId,
    all: async () => {
        const proCollection = db().collection(nameCollection);
        const list = await proCollection.find({}).toArray();
        //console.dir(list);
        return list;
    },
    addOne: async (entity) => {
        //console.log("---" +_id);
        var newUser = new User({
            username: entity.username,
            password_hash: entity.password_hash,
            name: entity.name,
            email: entity.email,
            dob: entity.dob,
            permission: entity.permission
        });
        //console.log(newPro);
        const catCollection = db().collection(nameCollection);
        return await catCollection.insertOne(newUser);
    },
    getOne: async (id) => {
        const catCollection = db().collection(nameCollection);
        const one = await catCollection.findOne({
            _id: ObjectId(id)
        })
        return one;
    },
    patchOne: async (entity) => {
        const catCollection = db().collection(nameCollection);
        return await catCollection.updateOne({
            "_id": ObjectId(entity._id)
        }, {
            $set: {
                "username": entity.username,
                "password_hash": entity.password_hash,
                "name": entity.name,
                "email": entity.email,
                "dob": entity.dob,
                "permission": parseInt(entity.permission)
            }
        });
    },
    delOne: async (id) => {
        const catCollection = db().collection(nameCollection);
        var result = null;
        try {
            result = await catCollection.deleteOne({
                "_id": ObjectId(id)
            });
        } catch (e) {
            console.log(e);
        }
        return result;
    }
}