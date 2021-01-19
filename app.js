const express = require('express')
const path = require('path')
const Mongoose = require('mongoose')

require('dotenv').config()

const app = express()

app.use(express.static(path.join(__dirname, 'public')))



app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`)


    const connect = () => {
        return Mongoose.connect(process.env.MONGODB_URL + "/databaza")
    }
    
    connect()
        .then(async conn => {
            console.log('Connected to DataBase')
        }).catch(err => {
            console.log(err)
        })
})