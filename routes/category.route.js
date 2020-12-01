const express = require('express');
const {
    Schema
} = require('mongoose');
const db = require('../utils/db');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res) {
    const list = await categoryModel.all();

    res.render('vwCategories/list', {
        categories: list,
        empty: list.length === 0
    });
})

router.get('/add', function (req, res) {
    res.render('vwCategories/add');
})

router.post('/add', async (req, res) => {
    console.log(req.body)
    var category = categoryModel.Category({
        Name: req.body.CatName
    });
    console.log(category);
    try {
        await category.save();
        res.send(category);

        res.redirect("vwCategories/list");
    } catch (err) {
        res.status(500).send(err);
    }

    
    // var category = categoryModel.Category({
    //     Name: req.body.CatName
    // });
    // console.log(category);
    // // category.save(function (err, book) {
    // //     if (err) return console.error(err);
    // //     console.log(category.Name + " saved to bookstore collection.");
    // //   });

    // category.save(function (err) {
    //     if (err) {
    //         console.log("err");
    //         res.json({
    //             "kq": 0,
    //             "errMsg": err
    //         });
    //     } else {
    //         console.log("not err");
    //         res.json({
    //             "kq": 1
    //         });
    //         console.log(req.body);
    //         res.send('ok');
    //     }
    // })
    // // const err = await categoryModel.save(req.body.CatName);
    // // if (err) {
    // //     res.json({
    // //         "kq": 0,
    // //         "errMsg": err
    // //     });
    // // } else {
    // //     res.json({
    // //         "kq": 1
    // //     });
    // //     console.log(req.body);
    // //     res.send('ok');
    // // }
    // // console.log("err: " + err);

});



module.exports = router;