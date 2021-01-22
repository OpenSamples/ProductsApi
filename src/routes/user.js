const express = require('express')
const User = require('../controllers/UsersController')
const router = require('./product')

router
    .get('/:username', async (req, res) => {
        let username = req.params.username
        try {
            const user = await User.findByUsername(username)

            res.status(200).json(user)
        } catch (e) {
            res.status(404).json(e)
        }
    })
    .post('/', async (req, res) => {
        let userBody = req.body

        try {
            const user = await User.create(userBody)

            res.status(201).json(user)
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .put('/:username', async (req, res) => {
        let username = req.params.username
        let userUpdate = req.body

        try {
            const user = await User.updateByUsername(username, userUpdate)

            res.status(201).json(user)
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .delete('/:username', async (req, res) => {
        let username = req.params.username

        try {
            const user = await User.deleteByUsername(username)

            res.status(200).json(user)
        } catch (e) {
            res.status(404).json(e)
        }
    })

module.exports = router