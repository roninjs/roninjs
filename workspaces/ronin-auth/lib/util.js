const crypto = require('crypto')

module.exports = {
  genRandomString,
  sha512
}

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function genRandomString( length ){
  return crypto.randomBytes( Math.ceil( length/2 ) )
    .toString( 'hex' )
    .slice( 0, length )
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function sha512( password, salt ) {
    const hash = crypto.createHmac( 'sha512', salt )
    hash.update( password )
    var value = hash.digest( 'hex' )
    return {
        salt: salt,
        hash: value
    }
}