const express = require('express')
//const dataModule = require('')
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
    if(req.files) {
        const productTitle = req.body.productTitle
        const productDescription = req.body.productDescription
        if(productTitle && productDescription && Object.keys(req.files).length > 1) {
            const imgs = []
            for(const key in req.files) {
                if(req.files[key].mimetype != '') {
                    imgs.push(req.files[key])
                }
            }
            dataModule.addproducts(productTitle, productDescription, imgs).then(() => {
                res.json(1)
            }).catch(error => {
                if(error == 3) {
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