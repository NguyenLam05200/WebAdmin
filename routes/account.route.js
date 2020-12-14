const express = require('express');
const moment = require('moment');
const bcrypt  = require('bcryptjs');
const userModel = require('../models/user.model')
const config = require('../config/default.json');


const router = express.Router();

router.get('/login', async function (req, res) {
    res.render('vwAccounts/login', {layout:false});
});

router.post('/login', async function (req, res) {
    const user  = await userModel.findByUsername(req.body.username);
    if(user === null) 
    {
        return res.render('vwAccounts/login', {
            layout: false,
            err: 'Invalid username or password.'
        });
    }

    const rs = bcrypt.compareSync(req.body.password, user.password_hash);
    if(rs===false){
        return res.render('vwAccounts/login', {
            layout: false,
            err: 'Invalid username or password.'
        });
    }
    //session
    delete user.password_hash;
    req.session.isAuthenticated = true;
    req.session.authUser = user;
    //session

    const url = req.query.retUrl || '/';
    res.redirect(url);
});

//session
const restrict = require('../middlewares/auth.mdw')
//session
router.post('/logout',restrict, function (req, res) {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    res.redirect(req.headers.referer); //đang ở đâu thì đá về chỗ đó
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


router.get('/profile', restrict, async function (req, res) {
    res.render('vwAccounts/profile');
});

module.exports = router;