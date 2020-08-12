//================== Require area===============================//
const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//======================== end Require area====================================//
//======================== Routs area=====================================//

//=================================0//
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/contact',(req,res)=>{
    res.render('contact')
})
//========================end  Routs area=====================================//

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});