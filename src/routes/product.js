const express = require('express')
const Product = require('../controllers/ProductsController')
const multer = require('multer')

// multer options
const upload = multer({
    dest: 'public/images',
    limits: {
        fileSize: 30
    },
    fileFilter(req, file, cb) {
        if (file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            cb(new Error('Please upload an image.'))
        }
        cb (undefined, true)
    }
})

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
    .post('/upload', upload.single('upload'), (req, res) => {
            res.send()
        }, (error, req, res, next) => {
            res.status(400).send({error: error.message})
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