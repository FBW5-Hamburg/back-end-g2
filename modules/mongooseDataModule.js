//===================== Require Area===========================//
//password hash
const passwordHash = require('password-hash')
//file system 
const fs = require('fs')
// require Mongoose
const mongoose = require('mongoose')
// getting connection string from data base
const connectionString = 'mongodb+srv://user1:MnZd6whfj08ESEh7@cluster0.jufz4.mongodb.net/test1?retryWrites=true&w=majority'

const Schema = mongoose.Schema

//  creating Schema
const customersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
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
    }

})
//
const Customers = mongoose.model('customers', customersSchema)
const Products = mongoose.model('products', productSchema)

//


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
function registerCustomer(email, password) {
    return new Promise((resolve, reject) => {
        connect().then(() => {
            const newCustomers = new Customers({
                email: email,
                password: passwordHash.generate(password)
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


 function addProduct (productName, productDescription, categories, color, prise, size, productImgs){
    return new Promise ((resolve, reject) => {
        connect().then(() => {
            Products.findOne({
                name: productName
            }).then(findProduct => {
                console.log(findProduct);
                if(findProduct) {
                    reject(3)
                } else {
                    const imgsArr = []
                    productImgs.forEach((img, idx) => {
                        // get file extension
                        let ext = img.name.substr(img.name.lastIndexOf('.'))
                        // set the new image name
                        let newName = productName.trim().replace(/ /g, '_') + '_' + idx + ext
                        img.mv('./public/uploadedfiles/' + newName)
                        imgsArr.push('/uploadedfiles/' + newName)
                    });
                    const newProduct = new Products({
                        name: productName,
                        description: productDescription,
                        imgs: imgsArr,
                        categories: categories,
                        prise: prise,
                        size: size,
                        color: color
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



module.exports = {

    registerCustomer,
    checkCustomer
}