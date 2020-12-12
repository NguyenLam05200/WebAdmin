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
let _id;
let extension = 'jpg';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/products')
    },
    filename: function (req, file, cb) {
        //let extArray = file.mimetype.split("/");
        //extension = extArray[extArray.length - 1];
        _id = new productModel.ObjectId();
      cb(null, _id.toString() + '.' + extension)
    }
});  
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpeg" || file.mimetype=="image/jpg" || file.mimetype=="image/gif"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("imgProduct"); // imgProduct is name in view vwProducts/add.hbs

router.get('/', async function (req, res) {
    const list = await productModel.all();
    res.render('vwProducts/list', {
        products: list,
        extension: extension,
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
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          console.log({"kq":0, "errMsg":"A multer error occured when uploading."}); 
        } else if (err) {
          console.log({"kq":0, "errMsg":"An unknown error occurred when uploading." + err});
        }else{
            const result = await productModel.addOne(req.body, _id);
            res.redirect('./');
        }
    });
});

router.get('/edit', async function (req, res) {
    const list = await categoryModel.getAll();

    const id = req.query.id || -1;
    const product = await productModel.getOne(id);
    console.log(product);
    res.render('vwProducts/edit', {
        product,
        categories: list,
        empty: list.length === 0
    });
})

router.post('/del', async (req, res) => {
    await productModel.delOne(req.body);
    res.redirect('./');
});

router.post('/update', async (req, res) => {
    console.log(req.body);

    await productModel.patchOne(req.body);
    res.redirect('./');
});

module.exports = router;