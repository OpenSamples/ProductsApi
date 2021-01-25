function validateProduct(product, every) {
    
    if('name' in product && !product.name) {
        return 'Invalid name!'
    }

    if('description' in product && !product.description) {
        return 'Invalid description!'
    }

    if('price' in product && !product.price) {
        return 'Invalid price'
    }

    if('quantity' in product && !product.quantity) {
        return 'Invalid quantity'
    }


    if(product.name && typeof product.name !== "string") {
        return 'Name must be a string!'
    }

    if(product.description && typeof product.description !== "string") {
        return 'Description must be a string!'
    }

    if(product.price && typeof product.price !== "number") {
        return 'Price must be a number!'
    }

    if(product.quantity && typeof product.quantity !== "number") {
        return 'Quantity must be a number!'
    }
    
    if(every) {
        if(product.name) {
            if(!(product.name.length >= 3 && product.name.length <= 15)) {
                return 'Name should be between 3 and 15 characters!'
            }
        } else if(!product.name) return 'Name should be defined!'

        if(product.description) {
            if(!(product.description.length >= 10 && product.description.length <= 150)) {
                return 'Description should be between 10 and 150 characters!'
            }
        }

        if(product.price) {
            if(!(product.price >= 1 && product.price <= 10000)) {
                return 'Price must be between 1 and 10000'
            }
        } else if(!product.price) return 'Price should be defined!'

        if(product.quantity) {
            if(!(product.quantity >= 1 && product.quantity <= 10)) {
                return 'Quantity must be between 1 and 10'
            }
        }

        return 'OK'
    } else {
        if(product.name) {
            if(!(product.name.length >= 3 && product.name.length <= 15)) {
                return 'Name should be between 3 and 15 characters!'
            }
        }

        if(product.description) {
            if(!(product.description.length >= 10 && product.description.length <= 150)) {
                return 'Description should be between 10 and 150 characters!'
            }
        }

        if(product.price) {
            if(!(product.price >= 1 && product.price <= 10000)) {
                return 'Price must be between 1 and 10000'
            }
        }

        if(product.quantity) {
            if(!(product.quantity >= 1 && product.quantity <= 10)) {
                return 'Quantity must be between 1 and 10'
            }
        }

        return 'OK'
    }
}


module.exports = validateProduct