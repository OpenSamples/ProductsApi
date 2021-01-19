const mongoose = require('mongoose');

require('dotenv').config()


const ProductSchema = new mongoose.Schema(
    {   
            name: {
                type: String,
                index: true,
                unique: true,
                required: true
            },
            description: {
                    type: String
            },
            image: {
                    type: String,
                    default: `${process.env.DEFAULT_SLIKA_PATH}/images/Rest-API.png`
            },
            price: {
                    type: Number,
                    required: true
            },
            quantity: {
                    type: Number,
                    default: 1,
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