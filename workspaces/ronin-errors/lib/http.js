const log = require( 'ronin-logger' )

module.exports = {
  InternalServerError,

  MissingParameterError
}

function base( code, message ) {
  const error = new Error( message )
  error.code = code
  return error 
}

function InternalServerError( msg ) {
  return base( 500, msg )
}

function MissingParameterError( msg ) {
  return base( 409, msg )
}
