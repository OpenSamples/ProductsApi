function validateUser(user, every) {

    if('username' in user && !user.username) {
        return 'Invalid username!'
    }

    if('password' in user && !user.password) {
        return 'Invalid password!'
    }

    if('email' in user && !user.email) {
        return 'Invalid email!'
    }

    if('role' in user && !user.role && user.role !== 0) {
        return 'Invalid role!'
    }

    if(user.username && typeof user.username !== "string") {
        return 'Username must be a string!'
    }

    if(user.password && typeof user.password !== "string") {
        return 'Password should be a string!'
    }

    if(user.email && typeof user.email !== "string") {
        return 'Email should be a string!'
    }

    if((user.role || user.role !== 0) && typeof user.role !== "number") {
        return 'Role must be a number!'
    }

    if(every) {
        if(user.username) {
            if(!(user.username.length >= 3 && user.username.length <= 20)) {
                return 'Username should be between 3 and 20 characters!'
            }
        } else if(!user.username) return 'Username should be defined!'

        if(user.password) {
            if(!(user.password.length >= 5 && user.password.length <= 25)) {
                return 'Password should be between 5 and 25 characters!'
            }

            if(!((/[a-z]/.test(user.password)) && (/[A-Z]/.test(user.password)) && (/[0-9]/.test(user.password)))) {
                return 'Password must contain at least one lowercase letter, one uppercase letter and one number!'
            }
        } else if(!user.password) return 'Password should be defined!'

        if(user.email) {
            if(!(user.email.length >= 5 && user.email.length <= 35)) {
                return 'Email should be between 5 and 35 characters!'
            }

            if(!validateEmail(user.email)) {
                return 'Email is invalid'
            }
        } else if(!user.email) return 'Email should be defined!'

        if(user.role || user.role === 0) {
            if(!(user.role === 0 || user.role === 1)) return 'Role should be 0 or 1'
        } else if(!user.role) return 'User role should be defined!'

        return 'OK'

    } else {
        if(user.username) {
            if(!(user.username.length >= 3 && user.username.length <= 20)) {
                return 'Username should be between 3 and 20 characters!'
            }
        }

        if(user.password) {
            if(!(user.password.length >= 5 && user.password.length <= 25)) {
                return 'Password should be between 5 and 25 characters!'
            }

            if(!((/[a-z]/.test(user.password)) && (/[A-Z]/.test(user.password)) && (/[0-9]/.test(user.password)))) {
                return 'Password must contain at least one lowercase letter, one uppercase letter and one number!'
            }
        }


        if(user.email) {
            if(!(user.email.length >= 5 && user.email.length <= 35)) {
                return 'Email should be between 5 and 35 characters!'
            }

            if(!validateEmail(user.email)) {
                return 'Email is invalid'
            }
        }

        if(user.role || user.role === 0) {
            if(!(user.role === 0 || user.role === 1)) return 'Role should be 0 or 1'
        }

        return 'OK'
    }
}


function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

module.exports = validateUser