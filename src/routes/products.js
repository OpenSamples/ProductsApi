const express = require('express')
const { findAll } = require('../controllers/ProductsController')

let router = express.Router()

router
    .get('/', async (req, res) => {
        try {
            const allProducts = await findAll()

            res.status(200).json(allProducts)
        } catch (err) {
            res.status(403).json(err)
        }
    })

module.exports = router