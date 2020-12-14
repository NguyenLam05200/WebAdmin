const express = require('express');
const moment = require('moment');
const bcrypt  = require('bcryptjs');
const userModel = require('../models/user.model')
const config = require('../config/default.json');


const router = express.Router();

router.get('/login', async function (req, res) {
    res.render('vwAccounts/login');
});

router.get('/register', async function (req, res) {
    res.render('vwAccounts/register');
});

router.post('/register', async function (req, res) {
    const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const password_hash = bcrypt.hashSync(req.body.password, config.authentication.saltRounds);
    const entity = {
        username: req.body.username,
        password_hash,
        name: req.body.name,
        email: req.body.email,
        dob,
        permission: 0
    }
    await userModel.addOne(entity);
    res.render('vwAccounts/register');
});

router.get('/profile', async function (req, res) {
    res.render('vwAccounts/profile');
});

module.exports = router;