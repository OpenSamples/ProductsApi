const express = require('express')
const path = require('path')
const Mongoose = require('mongoose')
const User = require('./src/models/User')
const Product = require('./src/models/Product')

require('dotenv').config()

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`)

    const connect = () => {
        return Mongoose.connect(process.env.MONGODB_URL + "/shopDB")
    }

    connect() 
        .then(async conn => {
            console.log('Connected to the database.')

            const user = await User.create(
                {
                    username: "ivanab", 
                    password: "Test000", 
                    email: "test@mail.com", 
                    role: 0
                })

            const product = await Product.create({
                name:"Jabuka",
                description:"Zelena jabuka",
                price: 100,
                quantity: 5,
                user: user._id
            })

            

            
        }).catch(err => {
            console.log(err)
        })
})