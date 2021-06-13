// this file includes all helper functions require by server

const CustomException = (msg, code) => {
    const error = new Error(msg) ;
    error.code = code ;

    return error ;
} ;

CustomException.prototype = Object.create(Error.prototype) ;

module.exports = {
    CustomException
} ;