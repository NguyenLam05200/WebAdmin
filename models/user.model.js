const bcrypt  = require('bcryptjs');

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
        const userCollection = db().collection(nameCollection);
        return await userCollection.insertOne(newUser);
    },
    getOne: async (id) => {
        const userCollection = db().collection(nameCollection);
        const one = await userCollection.findOne({
            _id: ObjectId(id)
        })
        return one;
    },
    findByUsername: async (username) => {
        const userCollection = db().collection(nameCollection);
        const rows = await userCollection.findOne({
            username: username
        })
        if (rows == null) {
            return null;
        }
        return rows;
    },
    patchOne: async (entity) => {
        const userCollection = db().collection(nameCollection);
        return await userCollection.updateOne({
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
        const userCollection = db().collection(nameCollection);
        var result = null;
        try {
            result = await userCollection.deleteOne({
                "_id": ObjectId(id)
            });
        } catch (e) {
            console.log(e);
        }
        return result;
    },
    /**
     * Check for valid username and password. Return user info if is valid.
     * @param {*} username 
     * @param {*} password 
     */
    checkCredential: async (username, password) =>{
        const userCollection = db().collection(nameCollection);
        const user = await userCollection.findOne({username});
        if(!user) return false;
        let checkPassword = await bcrypt.compare(password, user.password_hash);
        if(checkPassword){
            return user;    
        }
        return false;
    },
    getUser: (id) => {
        const userCollection = db().collection(nameCollection);
        const user = userCollection.findOne({
            _id: ObjectId(id)
        });
        //console.dir(user);
        return user;
    }
}