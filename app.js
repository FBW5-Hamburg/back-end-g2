//================== Require area===============================//
const express = require('express')
const session = require('express-session')

const adminRouter = require('./routes/adminRoutes')
const customerRoutes=require('./routes/customerRoutes')
const app = express()

// include dataModule
const dataModule = require('./modules/mongooseDataModule')


app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({extended: false}))
app.use(express.json())
const sessionOptions = {
    secret: 'Fashi | Template',
    cookie: {}
}
app.use(session(sessionOptions))
app.use('/admin', adminRouter)
//app.use('/shopLogout',customerRoutes)

//======================== end Require area====================================//
//======================== Routs area=====================================//
// to add parameter to ejs to use it  in ejs files

app.get('/', (req, res)=>{
res.render('index',{login: req.session.user})

});

app.get('/contact',(req,res)=>{
    res.render('contact',{login: req.session.user})
})
//=======================shop ============================//
app.get('/shop',(req,res)=>{
 
    res.render('shop', {login: req.session.user})
})

//==================== register===========================//
app.get('/register',(req,res)=>{
if (req.session.user){
    res.redirect('/')
} else {
    res.render('register', {login: req.session.user})
}
})
app.post('/register',(req,res)=>{
    
    // console.log(req.body);
    const name=req.body.name.trim();
    const email=req.body.email.trim();
    const password =req.body.password;
    const rePassword= req.body.password;
    if(name&&email&&password&&password==rePassword){
        dataModule.registerCustomer(name,email,password).then(()=>{
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
// console.log(req.session);
     if (req.session.user){
         res.redirect('/')
     } else {
          res.render('login', {login: req.session.user})
     }
  
})
app.get('/category/:cat', (req, res) => {
    const category = req.params.cat
    res.send(category)
})
app.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/login')
})
app.post('/login',(req,res)=>{
    // console.log(req.body);
    const logInEmail= req.body.email.trim();
    const logInPassword= req.body.password.trim();

    if(logInEmail&& logInPassword){
        dataModule.checkCustomer(logInEmail, logInPassword).then((customer)=>{
           
            req.session.user = customer
           res.json(1)
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
//  show product page
app.get('/showproduct',(req,res)=>{
    res.render('showproduct',{login:req.session.user})
})
//shopping_card page
app.get('/shoppingcard',(req,res)=>{
    res.render('shoppingcard',{login:req.session.user})
})



//========================end  Routs area=====================================//

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});