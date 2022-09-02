const handleDbErrMsg = (err) => {
    if(err.code && err.code === 11000){
        return `${Object.keys(err.keyPattern)[0]} already used`
    }

    //Joi validation message
    if(err.details && err.details[0].path[0]=== "email")
        return 'invalid email'
    if(err.details && err.details[0].path[0]=== "password")
        return "password must contain at least 8 caracters,an uppercase,a special caracter"
    if(err.details && err.details[0].path[0]=== "username")
        return "username must contain at least 3 caracters"
    return "Unhandled error message"
}

module.exports = handleDbErrMsg