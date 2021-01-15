const express = require('express');
const userModel = require('../models/user.model');
const config = require('../config/default.json');
const queryString = require('query-string');
var multer = require('multer');
var mkdirp = require('mkdirp');

const productModel = require('../models/product.model');
const categoryModel = require('../models/category.model');
const {
    Schema
} = require('mongoose');
const db = require('../utils/db');

const router = express.Router();


router.get('/', async function (req, res) {
    const limit = config.pagination.limit;
    const page = +req.query.page || 1;
    if (page < 0) page = 1;

    const q = req.query.q;
    const catName = req.params.catName;
    const filter = {};
    //console.log(filter);

    //2 ham async nay chay song song k lien quan j den nhau =>
    const [list, total] = await Promise.all([
        userModel.page(filter, limit, page),
        userModel.count(filter)
    ])
    console.log(list);
    
    // const [list, total] = await Promise.all([
    //     userModel.pageByCat(req.params.catName, limit, page),
    //     userModel.countByCat(req.params.catName)
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

    //const list = await userModel.allByCat(req.params.catName);
    // list.map(function (p){
    //     p.f_price = '$' + p.price ;
    // })

    // const list = await userModel.pageByCat(req.params.catName, limit, page);
    res.render('vwUsers/list', {
        imgDirParents: process.env.userS_IMAGE_DIR_FIXED,
        catName,
        users: list,
        empty: list.length === 0,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
});

module.exports = router;