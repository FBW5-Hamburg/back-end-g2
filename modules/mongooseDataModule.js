//===================== Require Area===========================//
//password hash
const passwordHash= require('password-hash')
//file system 
const fs = require('fs')
// require Mongoose
const mongoose = require('mongoose')
//
const connectionString ='mongodb+srv://user1:MnZd6whfj08ESEh7@cluster0.jufz4.mongodb.net/test1?retryWrites=true&w=majority'

const Schema = mongoose.Schema

//  creating Schema
const customerSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String, 
        required:true
    }
})
//
const Customer = mongoose.model('customer', customerSchema)
//=====================  end Require Area===========================//
//==================== function area========================//
//connect function ,
// function dataBaseConnect() {
//     return new Promise ((resolve,reject)=>{
//         if (mongoose.connection.readyState===1) {
//             resolve()
//         }else{
//             mongoose.dataBaseConnect( connectionString,{
//                 useUnifiedTopology: true,
//                 useCreateIndex: true,
//                 useNewUrlParser: true
//             }).then(()=>{
//                 resolve()
//             }).catch((error)=>{
//                 reject(error)
//             })
//         }
//     })
    
// }
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

// register Function 
function registerCustomer(email,password) {
    return new Promise((resolve,reject)=>{
        connect().then(()=>{
            const newCustomer = new Customer ({
                email:email,
                password:passwordHash.generate(password)
            })
            newCustomer.save().then((result)=>{
               resolve(result)
            }).catch(error=>{
                console.log(error);
                if (error.code === 11000) {
                    reject('exist');
                } else {
                    reject(error);
                }
            })
        }).catch((error)=>{
            reject(error)
        })
    })
    
}
module.exports={
  
    registerCustomer
}