const express = require('express');
const productModel = require('../models/product.model')
const {
    Schema
} = require('mongoose');
const db = require('../utils/db');

const router = express.Router();

router.get('/', async function (req, res) {
    const list = await productModel.all();

    res.render('vwProducts/list', {
        products: list,
        empty: list.length === 0
    });
});
router.get('/add', function (req, res) {
    res.render('vwProducts/add');
});
module.exports = router;