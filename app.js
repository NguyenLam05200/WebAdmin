const express = require('express');
const exphbs = require('express-handlebars');

const app = express();


app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.engine('hbs', exphbs({
    layoutsDir : 'views/_layouts',
    defaultLayout: 'main.hbs',
    partialsDir: 'views/_partials',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

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
// url k tồn tại
app.use(function (req, res){
    res.render('404', { layout: false });
})



const PORT = 3000;
app.listen(PORT, function () {
    console.log(`Server is running at http://localhost:${PORT}`);
})