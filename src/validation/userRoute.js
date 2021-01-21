function validatePost(userBody, query, username, productID) {
    if(userBody && Object.keys(userBody).length && query && (username || productID)) {
        return {
            error: true, 
            message: "Odlucite se hocete li da kreirate novog korisnika ili da dodate product od korisnika!",
            hint: "Popunili ste i body i parametre u istom requestu a mi to ne dozvoljavamo :-)"    
        }
    }

    if(userBody && !Object.keys(userBody).length && query && !username && !productID) {
        return {
            error: true,
            message: "Morate proslijediti ili podatke za kreiranje korisnika ili za dodavanje producta kod korisnika!"
        }
    }

    return false
}

async function createUser(userBody, User, query) {
    if(userBody && Object.keys(userBody).length) {
        try {
            const user = await User.create(userBody)
    
            return {user}
        } catch (error) {
            return {catchErr: true, error}
        }
    } else if(query && !Object.keys(query).length) {
        return {error: true, message: "Data not submited!"}
    }

    return false
}

async function addProductToUser(username, productID, User) {
    if(!username || !productID) {
        return {error: true, message: "Niste proslijedili username ili id!"}
    }

    try {
        const user = await User.updateProductsBy('username', username, productID)

        return {user}
    } catch (error) {
        return {catchErr: true, error}
    }

}

module.exports = {
    validatePost,
    createUser,
    addProductToUser
}