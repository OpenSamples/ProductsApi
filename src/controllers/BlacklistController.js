const Blacklist = require('../models/Blacklist')

function isTokenValid(token) {
    return new Promise(async (resolve, reject) => {
        try{
             const allTokens = await Blacklist.find({tokens: token}).exec()

             console.log(allTokens)
             if(allTokens[0]) {
                const tokens = allTokens[0].tokens

                if(!tokens.includes(token)) {
                    resolve({error: false})
                }  else {
                    reject({error: true, message: "Token is in blacklist!"})
                } 
             } else {
                 resolve({error: false})
             }

        } catch (e) {
            reject(e)
        }
    })
}

function addToken(token) {
    return new Promise(async (resolve, reject) => {
        try {
            const tokens = await Blacklist.create({tokens: token})
            console.log(tokens)
            resolve(tokens)
        } catch(e) {
            console.log('token')
            reject(e)
        }
    })
}

module.exports = {
    isTokenValid,
    addToken
}