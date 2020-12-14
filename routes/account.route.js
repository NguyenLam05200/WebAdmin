const express = require('express');
const config = require('../config/default.json');


const router = express.Router();

router.get('/login', async function (req, res) {
    res.render('vwAccounts/login');
});

router.get('/register', async function (req, res) {
    res.render('vwAccounts/register');
});

router.get('/profile', async function (req, res) {
    res.render('vwAccounts/profile');
});

module.exports = router;