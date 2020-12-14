require("dotenv").config();

const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
require('express-async-errors');
const numeral = require('numeral');

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.engine('hbs', exphbs({
    layoutsDir : 'views/_layouts',
    defaultLayout: 'main.hbs',
    partialsDir: 'views/_partials',
    extname: '.hbs',
    helpers: {
        section: hbs_sections(),
        format_number: function (value){
            return numeral(value).format('$0,0.00');
        }
    }
}));

app.set('view engine', 'hbs');

app.use('/public', express.static("public"));
app.use(express.static("public"));


const categoryModel = require('./models/category.model');

//middleware:để đầu, all api đều phải đi qua nó hết r mới làm gì làm
app.use(async function (req, res, next){
    const rows = await  categoryModel.getAll();
    //console.log(rows);
    res.locals.lcCategories = rows; //lc: local
    //console.log("------------------------------------");
    //console.log(res.locals.lcCategories);
    next();
})


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
app.use('/account', require('./routes/account.route'));


// url k tồn tại
//error 404
app.use(function (req, res){
    res.render('404', { layout: false });
})

//error 500 (query string sai,lỗi database đọc đĩa cứng, ...)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).render('500', {layout: false});
})



var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Server is running at http://localhost:${PORT}`);
})