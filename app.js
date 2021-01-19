const express = require('express')
const path = require('path')
const { json } = require('body-parser')

require('dotenv').config()

const connect = require('./helpers')

const product = require('./src/routes/product')
const products = require('./src/routes/products')
const user = require('./src/routes/user')
const users = require('./src/routes/users')


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
        .then(() => {
            console.log('DataBase is up!')
        }).catch(err => {
            console.log(err)
        })
})

