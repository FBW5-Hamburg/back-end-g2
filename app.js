//================== Require area===============================//
const express = require('express')
const session = require('express-session')
const fileupload = require('express-fileupload')
const cookie = require('cookie-parser')
const fs = require('fs')


const adminRouter = require('./routes/adminRoutes')
const dataModule = require('./modules/mongooseDataModule')
const app = express()




app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({extended: false}))
app.use(express.json())

const sessionOptions = {
    secret: 'bookStore',
    cookie: {}
}
app.use(session(sessionOptions))
app.use(cookie())
app.use(fileupload({
    limits: { fileSize: 50 * 1024 * 1024 }
}))



app.use('/admin', adminRouter)
//======================== end Require area====================================//
//======================== Routs area=====================================//

//=================================0//
app.get('/', (req, res) => {

    res.render('index')

});

app.get('/admin', (req, res) => {
    res.render('admin')
});



app.get('/contact',(req,res)=>{
    res.render('contact')
})
//=======================shop ============================//
app.get('/shop',(req,res)=>{
    res.render('shop')
})
//=====================shop_cart===========================//
app.get('/shopCart',(req,res)=>{
    res.render('shopCart')
})
//==================== register===========================//
app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/register',(req,res)=>{
    // console.log(req.body);
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
//======================== login================================//
//1=success or exist 
//2= missing entry
//3=not exist
//4=server problem
app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login',(req,res)=>{
    // console.log(req.body);
    const logInEmail= req.body.email.trim();
    const logInPassword= req.body.password.trim();

    if(logInEmail&& logInPassword){
        dataModule.checkCustomer(logInEmail, logInPassword).then((customer)=>{
            req.session.user = customer
            if (customer.role === "Admin"){
                res.json(1)
            } else {
                if (customer.role === "Customer") {
                     res.json(5)
                }
               
            }
          
})
       .catch((error)=>{
           if (error==3) {
               res.json(3)
           }else{
            res.json(4)
           }
       })
   }else{
    res.json(2)
   }

    
})
// app.get('/myproducts', (req, res) => {
//     dataModule.getAllBooks().then(products => {
//         res.render('myproducts', {products: products})
//     })
    
// });

//========================end  Routs area=====================================//

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});