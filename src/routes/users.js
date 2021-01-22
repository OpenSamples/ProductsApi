const express = require('express')
const { findAll } = require('../controllers/UsersController')

let router = express.Router()

router
    .get('/', async (req, res) => {
        try {
            const allUsers = await findAll()

            res.status(200).json(allUsers)
        } catch (err) {
            res.status(403).json(err)
        }
    })

module.exports = router