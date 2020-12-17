const express = require('express');
const queryString = require('query-string');
var multer = require('multer');


const productModel = require('../models/product.model');
const categoryModel = require('../models/category.model');
const config = require('../config/default.json');
const {
    Schema
} = require('mongoose');
const db = require('../utils/db');

const router = express.Router();


//multer
let _id;
let extension = null;
let fileImageName = null;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.PRODUCTS_IMAGE_DIR)
        //@ts-checkcb(null, 'public/images/products')
    },
    filename: function (req, file, cb) {
        //console.log("filenam: " + file.originalname);
        //if (file.originalname == '') console.log("null nha");
        //console.log("name truoc: " + fileImageName);
        if (fileImageName == null) {
            let extArray = file.mimetype.split("/");
            extension = extArray[extArray.length - 1];
            _id = new productModel.ObjectId();
            fileImageName = _id.toString() + '.' + extension;
        } else{
            let extArray = file.mimetype.split("/");
            extension = extArray[extArray.length - 1];
            fileImageName+=  '.' + extension;
        }
        //console.log("name sau: " + fileImageName);
        cb(null, fileImageName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/gif") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("imgProduct"); // imgProduct is name in view vwProducts/add.hbs

router.get('/', async function (req, res) {
    const limit = config.pagination.limit;
    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const q = req.query.q;
    const filter = {};
    if (q)
        filter.imgName = new RegExp(q, 'i');
    const [list, total] = await Promise.all([
        productModel.page(filter, limit, page),
        productModel.count(filter)
    ])



    // const total = await productModel.countByCat(req.params.catName);
    // nav paging, handle over page total
    const nPages = Math.ceil(total / config.pagination.limit);
    const page_items = [];
    const disabledItem = {
        value: '...',
        isActive: false,
        isDisabled: true
    }
    if (nPages < 15) {
        for (let i = 1; i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item);
        }
    } else {
        for (let i = 1; i <= 3; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item);
        }
        page_items.push(disabledItem);
        for (let i = page - 3; i <= page + 3; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item);
        }
        page_items.push(disabledItem);
        for (let i = nPages - 2; i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item);
        }
    }
    //---------------------------------------------------------------
    //console.log(page_items);
    for (const c of res.locals.lcCategories) {
        if (c.name == req.params.catName) {
            c.isActive = true;
        }
    }

    //const list = await productModel.allByCat(req.params.catName);
    // list.map(function (p){
    //     p.f_price = '$' + p.price ;
    // })
    console.log(req.query);
    // const list = await productModel.pageByCat(req.params.catName, limit, page);
    const nextQuery = {...req.query, page: page+1};//...req.query: lấy all thuộc tính object query hiện tại đổ vào nextQuery, sửa thuộc tính page thành page mới.
    const prevQuery = {...req.query, page: page-1};
    console.log(nextQuery);
    res.render('vwProducts/list', {
        products: list,
        empty: list.length === 0,
        page_items,
        prev_value: page - 1,
        prevPageQueryString: queryString.stringify(prevQuery), //=?pagep{{prev_value}}
        next_value: page + 1,
        nextPageQueryString: queryString.stringify(nextQuery), //
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
});

router.get('/byCat/:catName', async function (req, res) {
    const limit = config.pagination.limit;
    const page = +req.query.page || 1;
    if (page < 0) page = 1;

    const q = req.query.q;
    const catName = req.params.catName;
    const filter = {};
    if (q)
        filter.imgName = new RegExp(q, 'i');
    if (catName)
        filter.category = catName;
    //console.log(filter);

    //2 ham async nay chay song song k lien quan j den nhau =>
    const [list, total] = await Promise.all([
        productModel.page(filter, limit, page),
        productModel.count(filter)
    ])

    // const [list, total] = await Promise.all([
    //     productModel.pageByCat(req.params.catName, limit, page),
    //     productModel.countByCat(req.params.catName)
    // ])

    // nav paging, handle over page total
    const nPages = Math.ceil(total / config.pagination.limit);
    const page_items = [];
    const disabledItem = {
        value: '...',
        isActive: false,
        isDisabled: true
    }
    if (nPages < 15) {
        for (let i = 1; i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item);
        }
    } else {
        for (let i = 1; i <= 3; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item);
        }
        page_items.push(disabledItem);
        for (let i = page - 3; i <= page + 3; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item);
        }
        page_items.push(disabledItem);
        for (let i = nPages - 2; i <= nPages; i++) {
            const item = {
                value: i,
                isActive: i === page
            }
            page_items.push(item);
        }
    }
    //---------------------------------------------------------------
    //console.log(page_items);
    for (const c of res.locals.lcCategories) {
        if (c.name == req.params.catName) {
            c.isActive = true;
        }
    }

    //const list = await productModel.allByCat(req.params.catName);
    // list.map(function (p){
    //     p.f_price = '$' + p.price ;
    // })

    // const list = await productModel.pageByCat(req.params.catName, limit, page);
    res.render('vwProducts/byCat', {
        catName: list[0].category,
        products: list,
        empty: list.length === 0,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
});

router.get('/add', async function (req, res) {
    const list = await categoryModel.getAll();
    const q = req.query.catName;
    for(let i = 0; i<list.length; i++){
        if(list[i].name == q){
            list[i].isSelected = true;
        } else {
            list[i].isSelected = false;
        }
    }
    fileImageName = null;
    res.render('vwProducts/add', {
        categories: list,
        empty: list.length === 0
    });
});

router.post('/add', async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log({
                "kq": 0,
                "errMsg": "A multer error occured when uploading."
            });
        } else if (err) {
            console.log({
                "kq": 0,
                "errMsg": "An unknown error occurred when uploading." + err
            });
        } else {
            //console.log(fileImageName);
            const result = await productModel.addOne(req.body, _id, fileImageName);
            res.redirect('./');
        }
    });
});

router.get('/edit', async function (req, res) {
    const list = await categoryModel.getAll();
    
    const id = req.query.id || -1;
    fileImageName = id;
    const product = await productModel.getOne(id);
    //console.dir(list[0]);
    for(let i = 0; i<list.length; i++){
        if(list[i].name == product.category){
            list[i].isSelected = true;
        } else {
            list[i].isSelected = false;
        }
    }
    //console.dir(list);
    //console.log(product);
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
    //console.log(req.body);
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.log({
                "kq": 0,
                "errMsg": "A multer error occured when uploading."
            });
        } else if (err) {
            console.log({
                "kq": 0,
                "errMsg": "An unknown error occurred when uploading." + err
            });
        } else {
            //console.log(fileImageName);
            await productModel.patchOne(req.body);
            res.redirect('./');
        }
    });
    //await productModel.patchOne(req.body);
    //res.redirect('./');
});

module.exports = router;