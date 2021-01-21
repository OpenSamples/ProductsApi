const express = require('express')
const path = require('path')
const Mongoose = require('mongoose')

require('dotenv').config()

app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`)

    const connect = () => {
        return Mongoose.connect(process.env.MONGODB_URL + "/shopDB")
    }

    connect() 
        .then(async conn => {
            console.log('Connected to the database.')
        }).catch(err => {
            console.log(err)
        })
})