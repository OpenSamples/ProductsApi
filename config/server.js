const express = require('express')
const path = require('path')
const { json } = require('body-parser')

const routes = require('../src/routes')
const { verifyToken } = require('../src/services/Auth')

const app = express()


app.use(express.static(path.join(__dirname, '..' ,'public')))
app.use(json())
app.use(verifyToken)
app.use('/', routes)


module.exports = app