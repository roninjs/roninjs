const handler = require( '../handlers' )

module.exports = function configure( router ) {
  router.get(  		`/:entity`, 			handler.entitySearch )
  router.post( 		`/:entity`, 			handler.entityCreate )
  router.get(  		`/:entity/:id`, 	handler.entityById )
  router.put(  		`/:entity/:id`, 	handler.entityUpdate )
  router.delete(  `/:entity/:id`, 	handler.entityDelete )
}
