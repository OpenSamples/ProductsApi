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
            console.log('aaaaa')
            reject(e)
        }
    })
}



module.exports = {
    findAll,
    findByUsername,
    deleteByUsername,
    updateByUsername,
    create
}