//================== Require area===============================//
const express = require('express')


const adminRouter = require('./routes/adminRoutes')
const app = express()
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/admin', adminRouter)
//======================== end Require area====================================//
//======================== Routs area=====================================//
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/shop', (req, res) => {
    res.render('shop')
});
app.get('/admin', (req, res) => {
    res.render('admin')
});
app.get('/addproducts', (req, res) => {
    res.render('addproducts')
});
//========================end  Routs area=====================================//

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});