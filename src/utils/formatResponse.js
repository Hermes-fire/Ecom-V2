const formatResponse = ( message = 'Something went wrong', data = {}, error = {} ) => {
    return {
        message,
        data,
        error,
    }
}

module.exports = formatResponse