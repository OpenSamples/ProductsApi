const crypto = require('crypto');
const mongoose = require('mongoose');
const validate = require('mongoose-validator');

require('dotenv').config()


let nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name should be between 3 and 20 characters!'
    })
]

let passwordValidator = [
    validate({
        validator: 'isLength',
        arguments: [5, 25],
        message: 'Password should be between 5 and 25 characters!'
    }),
    validate({
            validator: val => {
                    return (/[a-z]/.test(val)) && (/[A-Z]/.test(val)) && (/[0-9]/.test(val))
            },
            message: 'Password must contain at least one lowercase letter, one uppercase letter and one digit!'
    })
]

let emailValidator = [
        validate({
                validator: 'isLength',
                arguments: [5, 35],
                message: 'Email should be between 5 and 25 characters!'
        }),
        validate({
                validator: 'isEmail',
                message: 'You should provide email!'
        })
]

let roleValidator = [
        validate({
                validator: val => {
                        return val === 0 || val === 1
                },
                message: 'Role must be 0 or 1'
        })
]

const UserSchema = new mongoose.Schema(
        {   
                username: {
                    type: String,
                    index: true,
                    unique: true,
                    required: true,
                    validate: nameValidator
                },
                password: {
                        type: String,
                        required: true,
                        validate: passwordValidator
                        // bcrypt: true,
                },
                email: {
                        type: String,
                        unique: true,
                        required: true,
                        validate: emailValidator
                },
                role: {
                        type: Number,
                        required: true,
                        validate: roleValidator
                },
                product: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'product'
                }]
        },
        { timestamps: true },
);


UserSchema.pre('save', function(next) {
        this._doc.password = crypto.createHmac('sha256', process.env.PASSWORD_SECRET)
                                        .update(this._doc.password)
                                        .digest('hex');
        next()
});



module.exports = mongoose.model('user', UserSchema);