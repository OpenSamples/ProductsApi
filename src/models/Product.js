const mongoose = require('mongoose');
const validate = require('mongoose-validator');

require('dotenv').config()

let nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 15],
        message: 'Name should be between 3 and 20 characters!'
    })
]

let descriptionValidator = [
    validate({
        validator: 'isLength',
        arguments: [10, 150],
        message: 'Description should be between 10 and 150 characters!'
    })
]

let quantityValidator = [
    validate({
        validator: val => {
          return val >= 1 && val <= 10
        },
        message: 'Quantity must be between 1 and 10'
    })
]

let priceValidator = [
    validate({
        validator: val => {
            return val >= 1 && val <= 10000
        },
        message: 'Price must be between 1 and 10000'
    })
]

const ProductSchema = new mongoose.Schema(
    {   
            name: {
                type: String,
                index: true,
                unique: true,
                required: true,
                validate: nameValidator
            },
            description: {
                    type: String,
                    validate: descriptionValidator
                    // bcrypt: true,
            },
            image: {
                    type: String,
                    default: `${process.env.DEFAULT_SLIKA_PATH}/images/Rest-API.png`
            },
            price: {
                    type: Number,
                    required: true,
                    validate: priceValidator
            },
            quantity: {
                    type: Number,
                    default: 1,
                    validate: quantityValidator
            },
            user: {
                    type: mongoose.Schema.Types.ObjectId,
                    // required: true, 
                    ref: 'user'
            }
    },
    { timestamps: true },
);


module.exports = mongoose.model('product', ProductSchema);