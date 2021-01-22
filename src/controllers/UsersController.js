const crypto = require('crypto')
const User = require('../models/User')
const validation = require('../validation/user')
const Product = require('../models/Product')

function findAll() {
    return new Promise((resolve, reject) => {
        try {
            resolve(User.find({}).lean().exec())
        } catch (e) {
            reject(e)
        }
    })
}

function findByUsername(username) {
    return new Promise((resolve, reject) => {
        try {
            resolve(User.find({username}).exec())
        } catch (e) {
            reject(e)
        }
    })
}

function deleteByUsername(username) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOneAndDelete({username}).exec()

            await Product.deleteMany({_id: {$in: user.product}}).exec()

            resolve(user)
        } catch (e) {
            reject(e)
        }
    })
}

function updateByUsername(username, user) {
    return new Promise((resolve, reject) => {
        try {
            let validationData = validation(user)
            if(validationData !== 'OK') {
                reject({"Error": true, "message": validationData})
            } else {
                if(user.password) {
                    user.password = 
                                crypto
                                    .createHmac('sha256', process.env.PASSWORD_SECRET)
                                    .update(user.password)
                                    .digest('hex');
                }
                resolve(User.findOneAndUpdate({username}, user).exec())
            }
        } catch (e) {
            reject(e)
        }
    })
}

function create(user) {
    return new Promise((resolve, reject) => {
        try {
            let validationData = validation(user, true)
            if(validationData !== 'OK') {
                reject({"Error": true, "message": validationData})
            } else {
                resolve(User.create(user))
            }

        } catch (e) {
            reject(e)
        }
    })
}

function updateProductsBy(type, val, productID) {
    return new Promise((resolve, reject) => {
        try {
            if(!val || !productID) {
                reject({"Error": true, "message": "Username or productID is not defined!"})
            } else {
                if(type === 'username') {
                    resolve(User.findOneAndUpdate({username: val}, { $addToSet: {product: productID}}))
                } else if(type === 'id') {
                    resolve(User.findOneAndUpdate({_id: val}, { $addToSet: {product: productID}}))
                }
            }
        } catch (e) {
            reject(e)
        }
    }) 
}

function deleteProductFrom(type, val, productID) {
    return new Promise((resolve, reject) => {
        try {

            if(type === 'username') {
                resolve(User.findOneAndUpdate({username: val}, { $pullAll: {product: [productID]} }))
            } else if (type === 'id') {
                resolve(User.findOneAndUpdate({_id: val}, { $pullAll: {product: [productID]} }))
            }
        } catch (e) {
            reject(e)
        }
    })
}


function Auth(email, password, type) {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await User.find({[type]: email}).exec()

            if(users[0]) {
                const user = users[0]

                const providedPw = crypto
                                    .createHmac('sha256', process.env.PASSWORD_SECRET)
                                    .update(password)
                                    .digest('hex');

                if(providedPw === user.password) {

                    resolve(user)
                } else {
                    reject({
                        error: true,
                        message: "Password is incorrect!"
                    })
                }

            } else {
                reject({error: true, message: "User does not exist!"})
            }

        } catch (e) {
            reject(e)
        }
    })
}


function register(user) {
    return new Promise( async (resolve, reject) => {
        try {
            const currentUsers = await findAll()

            if(!currentUsers.length) {
                user.role = 1
            } else {
                user.role = 0
            }
            
            let validationData = validation(user, true)
            if(validationData !== 'OK') {
                reject({"Error": true, "message": validationData})
            } else {
                const userRegistered = await User.create(user)

                resolve(userRegistered)
            }

        } catch (e) {
            reject(e)
        }
    })
}


function getAdminMails() {
    return new Promise((resolve, reject) => {
        try {
            resolve(User.find({role: 1}, {email:1, _id:0}).exec())
        } catch(e) {
            reject(e)
        }
    })
}


module.exports = {
    findAll,
    findByUsername,
    deleteByUsername,
    updateByUsername,
    create,
    updateProductsBy,
    deleteProductFrom,
    Auth,
    register,
    getAdminMails
}