//================== Require area===============================//
const express = require('express')


const adminRouter = require('./routes/adminRoutes')
const app = express()

// include dataModule
const dataModule = require('./modules/mongooseDataModule')


app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/admin', adminRouter)
//======================== end Require area====================================//
//======================== Routs area=====================================//

//=================================0//
app.get('/', (req, res) => {

    res.render('index')

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


app.get('/contact',(req,res)=>{
    res.render('contact')
})

app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/register',(req,res)=>{

    console.log(req.body);
    const email=req.body.email.trim();
    const password =req.body.password;
    const rePassword= req.body.password;
    if(email&&password&&password==rePassword){
        dataModule.registerCustomer(email,password).then(()=>{
            res.json(1)
        }).catch((error)=>{
            console.log(error);
            if (error=='exist') {
                res.json(3)
            }else{
                res.json(4)
            }
        })
    }else{
        res.json(2)
    }



    
})

//========================end  Routs area=====================================//

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});