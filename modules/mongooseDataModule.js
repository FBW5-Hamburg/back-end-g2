//===================== Require Area===========================//
//password hash
const passwordHash = require('password-hash')
//file system 
const fs = require('fs')
// require Mongoose
const mongoose = require('mongoose')
// getting connection string from data base

const connectionString = 'mongodb+srv://FBW-5:yZiPlwogw25pajKs@cluster0.26nmv.mongodb.net/test2?retryWrites=true&w=majority'

const Schema = mongoose.Schema

//  creating Schema
const customersSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true

    }
})

const productSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    imgs: {
        type: [String],
        required: true,
        min: 1
    },
    categories: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    }

})
//
const Customers = mongoose.model('customers', customersSchema)
const Products = mongoose.model('products', productSchema)

//


//creating users schema
//  const adminSchema= new Schema({})
// const admins = mongoose.model('users', adminSchema)
// //creating Products schema
// const productsSchema= new Schema({})
//  const products = mongoose.model('users', productsSchema)




//=====================  end Require Area===========================//
//==================== function area========================//
function connect() {
    return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState === 1) {
            resolve()
        } else {
            mongoose.connect(connectionString, {
                useUnifiedTopology: true,
                useCreateIndex: true,
                useNewUrlParser: true
            }).then(() => {
                resolve()
            }).catch(error => {
                reject()
            })
        }

    })
}
// register customer and creat an account  
function registerCustomer(name,email, password) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            const newCustomers = new Customers({
                name:name,
                email: email,
                password: passwordHash.generate(password),
                role:'customer'
            })
            newCustomers.save().then((result) => {
                resolve(result)
            }).catch(error => {
                console.log(error);
                if (error.code === 11000) {
                    reject('exist');
                } else {
                    reject(error);
                }
            })
        }).catch((error) => {
            reject(error)
        })
    })

}
// check if the customer has an account in the Data base
function checkCustomer(email,password) {
     return new Promise((resolve, reject) => {
       connect().then(() => {
        Customers.findOne({
                email: email
            }).then((result) => {
                 console.log(result);
                if (result) {
                    if (passwordHash.verify(password, result.password)) {
                        //exist
                        resolve(result)
                    } else {
                        //not exist
                        reject(3)
   }
                } else {
                    reject(3)
                }
            }).catch(error => {
                console.log(error);
                reject(error)
            })
        }).catch((error) => {
            console.log(error);
            reject(error)
      })
    })

 }
 //get Product
//  function getProduct(id) {
//      return new Promise((resolve,reject)=>{
// connect().then(()=>{
//        products.findOne({_id=id}).then(product=>{
//            resolve(product)
//        }).catch(error=>{reject(error)})
// }).catch((error)=>{reject(error)})
//      })
     
//  }
 //delete Product 
//  function deleteProduct(productId,userId) {
//      return new Promise((resolve,reject)=>{
//         getProduct(productId).then(product=>{
//             //delete imgs from publics folder
//             if (product.userid==userId) {
//                 product.imgs.forEach(img => {
//                     if(fs.existsSync('./public'+ img)){
//                         fs.unlinkSync('./public'+img)
//                     }
//                 });  
                //deleting the product from Database( products) the database name 
                // products.deleteOne()

//             }
//         })
//      })
//  }




 function addProduct (productName, productDescription, categories, color, prise, size, productImgs, userid){
    return new Promise ((resolve, reject) => {
        connect().then(() => {
            Products.findOne({
                name: productName,
                userid: userid
            }).then(findProduct => {
                //console.log(findProduct);
                if(findProduct) {
                    reject(3)
                } else {
                    const imgsArr = []
                    productImgs.forEach((img, idx) => {
                        // get file extension
                        let ext = img.name.substr(img.name.lastIndexOf('.'))
                        // set the new image name
                        let newName = productName.trim().replace(/ /g, '_') + '_' + userid + '_' + idx + ext
                        img.mv('./public/uploadedfiles/' + newName)
                        imgsArr.push('/uploadedfiles/' + newName)
                    });
                    const newProduct = new Products({
                        name: productName,
                        description: productDescription,
                        imgs: imgsArr,
                        categories: categories,
                        price: prise,
                        size: size,
                        color: color,
                        userid: userid
                    })
                    newProduct.save().then(() => {
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                }
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            console.log(error);
            reject(error)
        })
    })
 }

 function getAllProducts() {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            Products.find().then(products => {
                products.forEach(product => {
                    product['id'] = product['_id']
                })
                resolve(products)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}

function userProducts(userid) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            products.find({
                userid: userid
            }).then(products => {
                products.forEach(product => {
                    product['id'] = product['_id']
                })
                resolve(products)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}

function getProduct (id) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            Products.findOne({
                _id: id
            }).then(product => {
                resolve(product)
            }).catch(error => {
                reject(error)
            })
        }).catch(error => {
            reject(error)
        })
    })
}


module.exports = {

    registerCustomer,
    checkCustomer,
    addProduct,
    getAllProducts,
    userProducts,
    getProduct
}