require('dotenv').config()

const connect = require('./helpers')
const app = require('./config/server')


app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`)

    connect('databaza')
        .then(() => {
            console.log('DataBase is up!')
        }).catch(err => {
            console.log(err)
        })
})