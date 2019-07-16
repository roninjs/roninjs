const log = require( 'ronin-logger' )
const handler = require( './auth' )

let context = {}

function init( config ) {
  context = {
    collection: config.usersCollection,
    secret: config.secret
  }
}

function setContext( req, res, next ) {
  req.context = context
  next()
}

function useServer( router ) {

  router.post( `/login`, setContext, handler.login )

  return router
}

module.exports = {
  init,
  server: useServer
}