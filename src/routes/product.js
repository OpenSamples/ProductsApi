const express = require('express')
const Product = require('../controllers/ProductsController')
const multer = require('multer')

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
})

// multer options
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3145728
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
    .post('/upload', upload.single('upload'), async (req, res) => {
        try {
            const upload = req.file;

            res.send({
                status: true,
                message: 'File is uploaded.',
                data: {
                    name: upload.originalname,
                    mimetype: upload.mimetype,
                    size: upload.size
                }
            })
        } catch (err) {
            res.status(500).send(err)
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