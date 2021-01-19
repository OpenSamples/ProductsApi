const express = require('express')
const Product = require('../controllers/ProductsController')

let router = express.Router()

router
    .get('/:name', async (req, res) => {
        let name = req.params.name
        try {
            const product = await Product.findByName(name)

            res.status(200).json(product)
        } catch (e) {
            res.status(404).json(e)
        }
    })
    .post('/', async (req, res) => {
        let productBody = req.body

        try {
            const product = await Product.create(productBody)

            res.status(201).json(product)
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .put('/:name', async (req, res) => {
        let name = req.params.name
        let productUpdate = req.body

        try {
            const product = await Product.updateByName(name, productUpdate)

            res.status(201).json(product)
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .delete('/:name', async (req, res) => {
        let name = req.params.name
        
        try {
            const product = await Product.deleteByName(name)

            res.status(200).json(product)
        } catch (e) {
            res.status(404).json(e)
        }
    })


module.exports = router