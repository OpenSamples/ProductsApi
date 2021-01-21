const express = require('express')
const Product = require('../controllers/ProductsController')

let router = express.Router()

router
    .get('/product/:name', async (req, res) => {
        let name = req.params.name
        try {
            const product = await Product.findBy('name', name)

            res.status(200).json(product)
        } catch (e) {
            res.status(404).json(e)
        }
    })
    .post('/product', async (req, res) => {
        let productBody = req.body
        productBody.user = req.id

        try {
            const product = await Product.create(productBody)

            res.status(201).json(product)
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .put('/product/:name', async (req, res) => {
        let name = req.params.name
        let productUpdate = req.body

        try {
            const product = await Product.updateBy('name', name, productUpdate)

            res.status(201).json(product)
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .delete('/product/:name', async (req, res) => {
        let name = req.params.name
        
        try {
            const product = await Product.deleteBy('name', name)

            res.status(200).json(product)
        } catch (e) {
            res.status(404).json(e)
        }
    })
    .get('/products', async (req, res) => {
        let specific = {
            limit: !isNaN(req.query.limit) ? +req.query.limit : null,
            offset: !isNaN(req.query.offset) ? +req.query.offset : null
        }

        try {
            let allProducts;
            if(!specific.limit && specific.limit !== 0 && specific.offset !== 0 && !specific.offset) {
                allProducts = await Product.findAll()
            } else {
                allProducts = await Product.findAll(specific)
            }
            
            res.status(200).json(allProducts)
        } catch (err) {
            res.status(403).json(err)
        }
    })


router
    .get('/product_id/:id', async (req, res) => {
        let id = req.params.id
        try {
            const product = await Product.findBy('id', id)

            res.status(200).json(product)
        } catch (e) {
            res.status(404).json(e)
        }
    })
    .put('/product_id/:id', async (req, res) => {
        let id = req.params.id
        let productUpdate = req.body

        try {
            const product = await Product.updateBy('id', id, productUpdate)

            res.status(201).json(product)
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .delete('/product_id/:id', async (req, res) => {
        let id = req.params.id
        
        try {
            const product = await Product.deleteBy('id', id)

            res.status(200).json(product)
        } catch (e) {
            res.status(404).json(e)
        }
    })



router
    .put('/product_dec/:id', async (req, res) => {
        let id = req.params.id

        try {
            const product = await Product.incQuantity(id, -1)

            res.status(201).json(product)
        } catch (e) {
            res.status(403).json(e)
        }
    })

router
    .put('/product_inc/:id', async (req, res) => {
        let id = req.params.id

        try {
            const product = await Product.incQuantity(id, 1)

            res.status(201).json(product)
        } catch (e) {
            res.status(403).json(e)
        }
    })

router
    .get('/product_num/:id', async (req, res) => {
        let id = req.params.id
        try {
            const product = await Product.findBy('id', id)

            res.status(200).json(product[0].quantity)
        } catch (e) {
            res.status(404).json(e)
        }
    })


module.exports = router