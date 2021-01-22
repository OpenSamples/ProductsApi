const express = require('express')
const User = require('../controllers/UsersController')
const { signToken } = require('../services/Auth')
const Blacklist = require('../controllers/BlacklistController')

let router = express.Router()

router
    .post('/register', async (req, res) => {
        let info = req.body

        try {
            const register = await User.register(info)

            const token = signToken({
                _id: register._id,
                username: register.username,
                email: register.email,
                password: register.password,
                role: register.role
            })

            res.status(201).json({
                message: "Successfully!",
                token,
                user: register
            })
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .post('/login', async (req, res) => {
        let info = req.body

        if(info.password && (info.email || info.username)) {
            let password = info.password
            let type = info.email ? 'email' : 'username'
            let email = info.email ? info.email : info.username

            try {
                const credsCorrect = await User.Auth(email, password, type)

                if(credsCorrect.error) {
                    res.status(403).json(credsCorrect)
                } else {
                    const token = signToken({
                        _id: credsCorrect._id,
                        username: credsCorrect.username,
                        email: credsCorrect.email,
                        password: credsCorrect.password,
                        role: credsCorrect.role
                    })

                    res.status(200).json({
                        message: `${credsCorrect.username}, welcome back!`,
                        token,
                        user: credsCorrect
                    })
                }
            } catch (e) {
                res.status(403).json(e)
            }

        } else {
            res.status(403).json({
                error: true,
                message: "Please provide us email/username and password"
            })
        }
    })
    .get('/logout', async (req, res) => {
        const token = req.token

        try {
            const isLoggedOut = await Blacklist.addToken(token)

            if(isLoggedOut) {
                res.status(200).json({message: "Successfully logged out!"})
            } else {
                res.status(403).json({error: true, message: "Something went wrong!"})
            }
        } catch(e) {
            res.status(403).json(e)
        }
    })

module.exports = router