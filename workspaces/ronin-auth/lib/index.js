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

function useServer( router, rbac ) {

  if( rbac ) {
    router.post( `/login`,  setContext,                    handler.login )
    router.post( `/create`, setContext, rbac.can.create(), handler.createUser )
  } else {
    router.post( `/login`,  setContext, handler.login )
    router.post( `/create`, setContext, handler.createUser )
  }

  return router
}

module.exports = {
  init,
  server: useServer
}