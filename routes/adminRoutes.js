const express = require('express')
const dataModule = require('../modules/mongooseDataModule')
const adminRouter = express.Router()
// adminRouter.use((req, res ,next) => {
//     if (req.session.user) {
//         next()
//     } else {
//         res.redirect('/login')
//     }
// })
adminRouter.get('/', (req, res) => {
    res.render('admin')
})
adminRouter.get('/addproducts', (req, res) => {
    res.render('addproducts');
})
adminRouter.post('/addproducts', (req, res) => {

    // responses map
    // 1 book saved successfuly
    // 2 data error
//console.log(req.body);
//console.log(Object.keys( req.files));
if (req.files) {


const productName = req.body.productName
const productDescription = req.body.productDescription


if (productName && productDescription && Object.keys( req.files).length > 1){
    const imgs = []
    for (const key in req.files) {
        if (req.files[key].mimetype != 'application/pdf') {
            imgs.push(req.files[key])
            
        }
    }
    dataModule.addProduct(productName, productDescription, imgs, req.session.user._id ).then(() => {
        res.json(1)
    }).catch(error => {
        if (error == 3) {
            res.json(3)
        }
    })

} else {
    res.json(2)
}
} else {
    res.json(2)
}

})

adminRouter.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
});

module.exports = adminRouter