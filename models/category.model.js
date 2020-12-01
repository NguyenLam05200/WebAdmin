const {
    db
} = require('../utils/db');
const {
    ObjectId
} = require('mongodb');

const mongoose = require("mongoose");

const schemaCategory = new mongoose.Schema({
    Name: String
});
//var Category = mongoose.model('Category', schemaCategory, 'Category');
// module.exports = mongoose.model("Category", schemaCategory);

// compile schema to model
const Category = mongoose.model('Category', schemaCategory);
module.exports = Category;

module.exports = {
    all: async () => {
        const catCollection = db().collection('Category');
        const list = await catCollection.find({}).toArray();
        console.dir(list);
        return list;
    },
    one: async (id) => {
        const catCollection = db().collection('Category');
        const one = await catCollection.findOne({
            _id: ObjectId(id)
        })
        console.dir(one);
        return one;
    },
    save1: async (Name) => {
        var myobj = {
            Name: Name,
        };
        db().collection("Category").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });
    },
    save: async (Name) => {
        //console.log("save:" + Name);


        // a document instance
        var cat1 = new Category({
            Name: Name,
        });
        console.log("save:" + cat1);
        db().collection('Category');
        await cat1.save(function (err) {
            return err;
        })
    },
}