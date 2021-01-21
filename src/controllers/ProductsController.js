const Product = require('../models/Product')
const validation = require('../validation/product')
const User = require('./UsersController')

function findAll(specific) {
    return new Promise((resolve, reject) => {
        try {
            if(!specific) {
                resolve(Product.find({}).lean().exec())
            } else if((specific.limit || specific.limit === 0) && (specific.offset || specific.offset === 0)) {
                resolve(Product.find({}).limit(specific.limit).skip(specific.offset).exec())
            } else if(specific.limit || specific.limit === 0) {
                resolve(Product.find({}).limit(specific.limit).exec())
            } else if(specific.offset || specific.offset === 0) {
                resolve(Product.find({}).skip(specific.offset).exec())
            }
        } catch (e) {
            reject(false)
        }
    })
}

function findBy(nameORid, value) {
    return new Promise((resolve, reject) => {
        try {
            if(nameORid === 'name') {
                resolve(Product.find({name: value}).exec())
            } else if (nameORid === 'id') {
                resolve(Product.find({_id: value}).exec())
            }
        } catch (e) {
            reject(false)
        }
    })
}

function deleteBy(nameORid, value) {
    return new Promise(async (resolve, reject) => {
        try {
            let product

            if(nameORid === 'name') {
                product = await Product.findOneAndDelete({name: value}).exec()
            } else if(nameORid === 'id') {
                product = await Product.findOneAndDelete({_id: value}).exec()
            }

            User.deleteProductFrom('id', product.user, product._id)

            resolve(product)
        } catch (e) {
            reject(false)
        }
    })
}

function updateBy(nameORid, value, product) {
    return new Promise((resolve, reject) => {
        try {
            let validationData = validation(product)
            if(validationData !== 'OK') {
                reject({"Error": true, "message": validationData})
            } else {
                if(nameORid === 'name') {
                    resolve(Product.findOneAndUpdate({name: value}, product).exec())
                } else if(nameORid === 'id') {
                    resolve(Product.findOneAndUpdate({_id: value}, product).exec())
                }
            }
            
        } catch (e) {
            reject(false)
        }
    })
}

function create(product) {
    return new Promise(async (resolve, reject) => {
        try {
            let validationData = validation(product, true)

            if(validationData !== 'OK') {
                reject({"Error": true, "message": validationData})
            } else {
                const product_created = await Product.create(product)

                if(product_created._id) {
                    await User.updateProductsBy('id', product.user, product_created._id)
                }

                resolve(product_created)
            }

        } catch (e) {
            reject(false)
        }
    })
}

function incQuantity(id, val) {
    return new Promise((resolve, reject) => {
        try {
            if(val === 1) {
                resolve(Product.findOneAndUpdate({_id: id, quantity: {$lte: 9}}, {$inc: {quantity: val}}).exec())
            } else if(val === -1) {
                resolve(Product.findOneAndUpdate({_id: id, quantity: {$gte: 2}}, {$inc: {quantity: val}}).exec())
            }
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    findAll,
    findBy,
    deleteBy,
    updateBy,
    create,
    incQuantity
}