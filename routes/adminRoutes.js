const express = require('express')
//const dataModule = require('')
const adminRouter = express.Router()
adminRouter.use((req, res ,next) => {
    if (req.session.user) {
     if (req.session.user.role==='admin'){
         next()
        }else {
            res.redirect('/login')
        }
        //
    } else {
        res.redirect('/login')
    }
})
adminRouter.get('/', (req, res) => {
    res.render('admin',{login:req.session.user})
    console.log(req.session.user
        );
})
adminRouter.get('/addProducts', (req, res) => {
    res.render('addProducts',{login:req.session.user});
})
adminRouter.post('/addProducts', (req, res) => {
    console.log(req.body);
    console.log(req.files);
    if (req.files) {
        const productName = req.body.productName
        const productDescription = req.body.productDescription
        const productCategories = req.body.productCategories
        const productColor = req.body.productColor
        const productPrice = req.body.productPrice
        const productSize = req.body.productSize
        if (productName && productDescription && productCategories && productColor && productPrice && productSize && Object.keys(req.files).length > 1) {
            const imgs = []
            for (const key in req.files) {
                if (req.files[key].mimetype == 'image/jpeg') {
                    imgs.push(req.files[key])  
                } 
            }                                        
                    dataModule.addProduct(productName, productDescription, productCategories, productColor, productPrice, productSize, imgs, req.session.user._id).then(() => {
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
//=============================================//
adminRouter.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
});
//======================== delete Product============================//


module.exports = adminRouter