require("dotenv").config();
const express = require('express');

const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use('/public', express.static("public"));
app.use(express.static("public"));

require('./middlewares/session.mdw')(app); // require ra function()

require('./middlewares/view.mdw')(app); // require ra function()

//phân chia vùng view có thể xem (session)
require('./middlewares/locals.mdw')(app); // require ra function()

app.get('/', function (req, res) {
    res.render('home');
})

app.get('/about', function (req, res) {
    res.render('about');
})


// thể loại
app.use('/admin/categories', require('./routes/category.route'));
// sản phẩm
app.use('/admin/products', require('./routes/product.route'));
// đăng kí, đăng nhập, profile
app.use('/account', require('./routes/account.route'));


// chạy hết, nếu err thì quăng vô đây xử lí
require('./middlewares/errors.mdw')(app); // require ra function()


var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server is running at http://localhost:${PORT}`);
})