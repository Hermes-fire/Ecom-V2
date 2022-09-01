const handleDbErrMsg = (err) => {
    console.log(Object.keys(err.keyPattern)[0])
    if(err.code && err.code === 11000){
        return `${Object.keys(err.keyPattern)[0]} already used`
    }
    return "Unhandled error message"
}

module.exports = handleDbErrMsg