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

async function createUser(userBody, User, query, role) {


    if(userBody && Object.keys(userBody).length) {
        // Ako je user admin moci ce da kreira novog korisnika bio to admin/obican user
        if(role === 1) {
            try {
                const user = await User.create(userBody)
        
                return {user}
            } catch (error) {
                return {catchErr: true, error}
            }
        } else {
            return {error: true, message: "You are not admin! To register new user go to /register"}
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