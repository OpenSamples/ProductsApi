const User = require('../controllers/UsersController')
const Product = require('../controllers/ProductsController')

async function getZarada() {
    try {

        const users = await User.findAll()
        const zarada = []

        for(let i = 0; i < users.length; i++) {
            let user = users[i]
            let temp = {
                user: user.username,
                zarada: 0 
            }
            const products = await Product.findBy('id', user.product)

            for(let j = 0; j < products.length; j++) {
                let product = products[j]
                
                temp.zarada += product.quantity * product.price
            }

            zarada.push(temp)
        }

        return zarada
    } catch (e) {
        return {error: true, message: "Something went wrong!"}
    }
}


module.exports = getZarada