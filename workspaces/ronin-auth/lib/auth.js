const moment 		= require( 'moment' )
const errors = require( 'ronin-errors' )
const pluralize = require( 'pluralize' )
const log 			= require( 'ronin-logger' )

const Entity = require( 'ronin-entity' )

module.exports = {
	login
}

async function login( req, res, next ) {
	const collection = req.context.collection
	if( !collection ) {
		return next( errors.http.MissingParameterError( `Missing entity name` ) )
	}
  log.debug( `collection: ${collection}`)

	if( !req.body.username || !req.body.password ) {
		return next( errors.http.MissingParameterError( `Missing entity name` ) )
	}

	const query		=	{ username: req.body.username }

	const store = new Entity( collection )

	try {
		const total = await store.count( query )
		const results = await store.findOne( query )

		return res.json({ code: 'success', meta: { total: total, count: results.length || 0 }, payload: results })
	} catch( error ) {
		throw error
	}

}

