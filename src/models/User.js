const crypto = require('crypto');
const mongoose = require('mongoose');

require('dotenv').config()

const UserSchema = new mongoose.Schema(
        {   
                username: {
                    type: String,
                    index: true,
                    unique: true,
                    required: true,
                },
                password: {
                        type: String,
                        required: true
                },
                email: {
                        type: String,
                        unique: true,
                        required: true,
                },
                role: {
                        type: Number,
                        required: true,
                },
                product: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'product'
                }]
        },
        { timestamps: true },
);


UserSchema.pre('save', hashPassword);


function hashPassword(next) {
        this._doc.password = 
                crypto
                        .createHmac('sha256', process.env.PASSWORD_SECRET)
                        .update(this._doc.password)
                        .digest('hex');
        next()
}

module.exports = mongoose.model('user', UserSchema);