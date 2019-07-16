const log = require( 'ronin-logger' )
const handler = require( './handlers' )

function useServer( router, rbac ) {

  if( rbac ) {
    router.get(  		`/:entity`, 			rbac.can.read(),    handler.entitySearch )
    router.post( 		`/:entity`, 			rbac.can.create(),  handler.entityCreate )
    router.get(  		`/:entity/:id`, 	rbac.can.read(),    handler.entityById )
    router.put(  		`/:entity/:id`, 	rbac.can.update(),  handler.entityUpdate )
    router.delete(  `/:entity/:id`, 	rbac.can.delete(),  handler.entityDelete )
  } else {
    router.get(  		`/:entity`, 			handler.entitySearch )
    router.post( 		`/:entity`, 			handler.entityCreate )
    router.get(  		`/:entity/:id`, 	handler.entityById )
    router.put(  		`/:entity/:id`, 	handler.entityUpdate )
    router.delete(  `/:entity/:id`, 	handler.entityDelete )
  }

  return router
}

module.exports = {
  server: useServer
}