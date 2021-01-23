const Product = require('../models/Product')
const validation = require('../validation/product')

function findAll() {
    return new Promise((resolve, reject) => {
        try {
            resolve(Product.find({}).lean().exec())
        } catch (e) {
            console.log(e)
            reject(false)
        }
    })
}

function findByName(name) {
    return new Promise((resolve, reject) => {
        try {
            resolve(Product.find({name}).exec())
        } catch (e) {
            console.log(e)
            reject(false)
        }
    })
}

function deleteByName(name) {
    return new Promise((resolve, reject) => {
        try {
            resolve(Product.findOneAndDelete({name}).exec())
        } catch (e) {
            console.log(e)
            reject(false)
        }
    })
}

function updateByName(name, product) {
    return new Promise((resolve, reject) => {
        try {
            let validationData = validation(product)
            if (validationData !== 'OK') {
                reject({'Error': true, 'message': validationData})
            } else {
                resolve(Product.findOneAndUpdate({name}, product).exec())
            }
        } catch (e) {
            console.log(e)
            reject(false)
        }
    })
}

function create(product) {
    return new Promise((resolve, reject) => {
        try {
            let validationData = validation(product, true)

            if (validationData !== 'OK') {
                reject({'Error': true, 'message': validationData})
            } else {
                resolve(Product.create(product))
            }
        } catch (e) {
            console.log(e)
            reject(false)
        }
    })
}

module.exports = {
    findAll,
    findByName,
    deleteByName,
    updateByName,
    create
}