const express = require('express');
const router = express.Router();


router.get('/', async function (req, res) {
    res.send("chưa xử lí");
});

module.exports = router;