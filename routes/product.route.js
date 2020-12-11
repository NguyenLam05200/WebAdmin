const express = require('express');
const productModel = require('../models/product.model');
const categoryModel = require('../models/category.model');

const {
    Schema
} = require('mongoose');
const db = require('../utils/db');

const router = express.Router();


//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/imgs/sp')
    },
    filename: function (req, file, cb) {
        console.log("name" + file.originalname);
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log("file:" + file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpeg" || file.mimetype=="image/jpg" || file.mimetype=="image/gif"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("imgProduct"); // imgProduct is name in view vwProducts/add.hbs

router.get('/', async function (req, res) {
    const list = await productModel.all();
    console.log(list);
    res.render('vwProducts/list', {
        products: list,
        empty: list.length === 0
    });
});

router.get('/byCat/:catName', async function (req, res) {
    for(const c of res.locals.lcCategories){
        if(c.name == req.params.catName){
            c.isActive = true;
        }
    }

    const list = await productModel.allByCat(req.params.catName);
    // list.map(function (p){
    //     p.f_price = '$' + p.price ;
    // })
    res.render('vwProducts/byCat', {
        products: list,
        empty: list.length === 0
    });
});

router.get('/add',async function (req, res) {
    const list = await categoryModel.getAll();

    res.render('vwProducts/add', {
        categories: list,
        empty: list.length === 0
    });
});

router.post('/add', async (req, res) => {
    //upload file
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log({"kq":0, "errMsg":"A multer error occured when uploading."}); 
        } else if (err) {
          console.log({"kq":0, "errMsg":"An unknown error occurred when uploading." + err});
        }else{
            //save mongo
            console.log(req.body);
            // var marvel = Marvel({
            //     Name: req.body.txtName,
            //     Image: req.file.filename,
            //     Level: req.body.txtLevel
            // });

            // marvel.save(function(err){
            //     if(err){
            //         res.json({"kq":0, "errMsg":error});
            //     } else{
            //         res.redirect("/add");
            //     }
            // });
            res.send("done");
        }

    });
    // console.log(req.body);
    // //const result = await productModel.addOne(req.body);
    // //console.log(result);
    // res.redirect('./');
});

module.exports = router;