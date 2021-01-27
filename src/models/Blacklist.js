const mongoose = require('mongoose');

require('dotenv').config()


const BlacklistSchema = new mongoose.Schema(
    {   
            tokens: {
                type: String,
                required: true
            }
    },
    { timestamps: true },
);


module.exports = mongoose.model('blacklist', BlacklistSchema);