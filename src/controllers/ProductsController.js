const Product = require('../models/Product')
const validation = require('../validation/product')
const User = require('./UsersController')
const sendMail = require('../services/Mailer')

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

function deleteBy(userORproduct, type, value, productID) {
    return new Promise(async (resolve, reject) => {
        try {
            
            if(userORproduct === 'product') {
                let product
                if(type === 'name') {
                    product = await Product.findOneAndDelete({name: value}).exec()
                } else if(type === 'id') {
                    product = await Product.findOneAndDelete({_id: value}).exec()
                }

                await User.deleteProductFrom('id', product.user, product._id)

                resolve(product)
            } else if(userORproduct === 'user') {
                let user = await User.deleteProductFrom('username', value, productID)

                await Product.findOneAndDelete({_id: productID}).exec()

                resolve(user)
            }

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
                    let mail = await User.getAdminMails()

                    let mails = mail.map(el => el.email)
                    let dataToMail = [{}]
                    let allowedKeys = ['name', 'description', 'image', 'price', 'quantity', 'user']
                    for(let key in product_created) {
                        if(allowedKeys.includes(key)) {
                            dataToMail[0][key] = product_created[key]
                        }
                    }

                    sendMail(mails, dataToMail)
                }

                resolve(product_created)
            }

        } catch (e) {
            reject(e)
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