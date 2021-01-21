const crypto = require('crypto')
const User = require('../models/User')
const validation = require('../validation/user')

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
    return new Promise((resolve, reject) => {
        try {
            resolve(User.findOneAndDelete({username}).exec())
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




module.exports = {
    findAll,
    findByUsername,
    deleteByUsername,
    updateByUsername,
    create,
    updateProductsBy,
    deleteProductFrom
}