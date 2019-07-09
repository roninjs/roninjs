const log = require( 'ronin-logger' )
const handler = require( './handlers' )

function useServer( router ) {

  router.get(  		`/:entity`, 			handler.entitySearch )
  router.post( 		`/:entity`, 			handler.entityCreate )
  router.get(  		`/:entity/:id`, 	handler.entityById )
  router.put(  		`/:entity/:id`, 	handler.entityUpdate )
  router.delete(  `/:entity/:id`, 	handler.entityDelete )

  return router
}

module.exports = {
  server: useServer
}