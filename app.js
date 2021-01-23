const express = require('express')
const path = require('path')
const Mongoose = require('mongoose')
const { json } = require('body-parser')

require('dotenv').config()

const connect = require('./helpers')

const product = require('./src/routes/product')
const product = require('./src/routes/products')
const product = require('./src/routes/user')
const product = require('./src/routes/users')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(json())
app.use('/product', product)
app.use('/products', products)
app.use('/user', user)
app.use('/users', users)


app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`)
    
    connect('databaza')
        .then(async conn => {
            console.log('Connected to Database!')
        }).catch(err => {
            console.log(err)
        })
})