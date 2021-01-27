const jwt = require('jsonwebtoken')
require('dotenv').config()
const Blacklist = require('../controllers/BlacklistController')

function signToken(user, expiresIn = '2h') {
    const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn })

    return token
}

async function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"]

    if(req.path === '/register' || req.path === '/login') {
        next()
    } else {
        if(typeof bearerHeader !== "undefined") {

            const bearer = bearerHeader.split(' ')
            const bearerToken = bearer[1]
            
            try {
                const isBlacklisted = await Blacklist.isTokenValid(bearerToken)

                if(!isBlacklisted.error) {
                    const userData = jwt.verify(bearerToken, process.env.TOKEN_SECRET)
    
                    req.userData = userData
                    req.token = bearerToken
                    
                    next()
                } else {
                    res.status(403).json(isBlacklisted)
                }
            } catch (e) {

                res.status(403).json({
                    error: true,
                    message: 'Token is not valid!',
                    error_msg: e
                })
            }
                    
        } else {
            res.status(403).json({
                error: true,
                message: "Please log-in!"
            })
        }
    }
}

module.exports = {
    verifyToken,
    signToken
}