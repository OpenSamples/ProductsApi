const express = require('express')
const zarada = require('../services/zarada')

let router = express.Router()


router
    .get('/zarada', async (req, res) => {
        try {
            const profiti = await zarada()

            res.status(200).json(profiti)
        } catch (e) {
            res.status(403).json(e)
        }
    })



module.exports = router