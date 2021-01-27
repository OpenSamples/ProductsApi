const Mongoose = require('mongoose');


const connect = (db) => {
    return Mongoose.connect(`${process.env.MONGODB_URL}/${db}`)
}


module.exports = connect