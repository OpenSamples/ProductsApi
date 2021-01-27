const express = require('express')
const User = require('../controllers/UsersController')
const postRoute = require('../validation/userRoute')
const Product = require('../controllers/ProductsController')

let router = express.Router()

/* Prikazivanje odredjenog korisnika, dodavanje korisnika/dodavanje producta korisniku,
azuriranje korisnika, brisanje korisnika, prikazivanje svih korisnika */

router
    .get('/user/:username', async (req, res) => {
        let username = req.params.username
        try {
            const user = await User.findByUsername(username)

            res.status(200).json(user)
        } catch (e) {
            res.status(404).json(e)
        }
    })
    .post('/user', async (req, res) => {
        // Kreiramo variablu ako se preko request-a zeli kreirati novi korisnik
        let userBody = req.body

        // Kreiramo variable ako se preko request-a zeli dodati product korisniku
        let username = req.query.username
        let productID = req.query.id

        // Proveravamo da li se preko request-a kreira korisnik ili se zeli azurirati, 
        // ako ne, vraca error
        let isReqInvalid = postRoute.validatePost(userBody, req.query, username, productID)
        if(isReqInvalid) {
            return res.status(403).json(isReqInvalid)
        }

        // Proveravamo da li je request za kreiranje korisnika
        let isReqCreate = await postRoute.createUser(userBody, User, req.query, req.userData.role)
        
        // Ako je neki error iskocio saljemo error ili saljemo korisnika ako je kreiran 
        if(isReqCreate.catchErr) {
            return res.status(403).json(isReqCreate.error)
        } else if(isReqCreate.error) {
            return res.status(403).json(isReqCreate)
        } else if(isReqCreate.user) {
            const user = isReqCreate.user

            return res.status(201).json(user)
        }

        // Ovde stizemo ako request nije za kreiranje korisnika a request je validan

        // Gledamo ako je user admin ili pokusava svoje product da izmijeni ako nije vraca gresku
        if(req.userData.username === username || req.userData.role === 1) {
            // Proveravamo da li su username i id proslijedjeni ako jesu vrsimo update korisnika
            let isReqUpdate = await postRoute.addProductToUser(username, productID, User)
    
            // Ako je neki error iskocio saljemo error ili saljemo korisnika ako mu je product dodijeljen
            if(isReqUpdate.catchErr) {
                return res.status(403).json(isReqUpdate.error)
            } else if(isReqUpdate.error) {
                return res.status(403).json(isReqUpdate)
            } else if(isReqUpdate.user) {
                const user = isReqUpdate.user
    
                return res.status(201).json(user)
            }
        } else {
            return res.status(403).json({
                error: true,
                message: 'You cannot change others properties until you are admin!'
            })
        }
    })
    .put('/user/:username', async (req, res) => {
        let username = req.params.username
        let userUpdate = req.body

        try {
            const user = await User.updateByUsername(username, userUpdate)

            res.status(201).json(user)
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .delete('/user/:username', async (req, res) => {
        let username = req.params.username
        
        try {
            const user = await User.deleteByUsername(username)

            res.status(200).json(user)
        } catch (e) {

            res.status(404).json(e)
        }
    })
    .get('/users', async (req, res) => {
        try {
            const allUsers = await User.findAll()

            res.status(200).json(allUsers)
        } catch (err) {
            res.status(403).json(err)
        }
    })


/* Prikazivanje product polja kod korisnika, azuriranje producta ako postoji u polje kod korisnika, 
brisanje product polja kod korisnika */

router
    .get('/user', async (req, res) => {
        let username = req.query.username

        if(!username) {
            return res.status(403).json({error: true, message: "Niste proslijedili username korisnika!"})
        }

        try {
            const user = await User.findByUsername(username)

            res.status(200).json(user[0].product)
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .put('/user', async (req, res) => {
        let username = req.query.username
        let productID = req.query.id

        let userUpdate = req.body

        try {
            const user = await User.findByUsername(username)

            if(user[0].product.includes(productID)) {
                const product = await Product.updateBy('id', productID, userUpdate)

                res.status(201).json(product)
            } else {
                res.status(403).json({
                    error: true,
                    message: "User does not own product with that id!"
                })
            }
        } catch (e) {
            res.status(403).json(e)
        }
    })
    .delete('/user', async (req, res) => {
        let username = req.query.username
        let productID = req.query.id

        if(!username || !productID) {
            return res.status(403).json({error: true, message: "Username or productID is not defined!"})
        }

        try {
            const user = await Product.deleteBy('user', 'username', username, productID)

            res.status(200).json(user)
        } catch (e) {
            res.status(403).json(e)
        }
    })


module.exports = router