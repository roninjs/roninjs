const moment 		= require( 'moment' )
const errors 		= require( 'ronin-errors' )
const pluralize = require( 'pluralize' )
const log 			= require( 'ronin-logger' )

const Entity = require( 'ronin-entity' )

const util = require( './util' )

module.exports = {
	login,
	createUser
}

async function login( req, res, next ) {
	const collection = req.context.collection
	if( !collection ) {
		return next( errors.http.MissingParameterError( `Missing entity name` ) )
	}
  log.debug( `collection: ${collection}`)

	if( !req.body.username || !req.body.password ) {
		return next( errors.http.MissingParameterError( `Missing parameters` ) )
	}

	const query	=	{ username: req.body.username }

	const store = new Entity( collection )

	try {
		const total = await store.count( query )
		const results = await store.findOne( query )

		// if( results && results.length ) {
		// 	const user = results
		// }
		

		return res.json({ code: 'success', meta: { total: total, count: total }, payload: results })
	} catch( error ) {
		throw error
	}

}

async function createUser( req, res, next ) {
	const collection = req.context.collection
	if( !collection ) {
		return next( errors.http.MissingParameterError( `Missing entity name` ) )
	}
  log.debug( `collection: ${collection}`)

	if( !req.body.username || !req.body.password ) {
		return next( errors.http.MissingParameterError( `Missing parameters` ) )
	}

	const salt = util.genRandomString( 32 )
	const passwordData = util.sha512( req.body.password, salt )

	const store = new Entity( collection )
	try {
		const newUser = {
			username: req.body.username,
			passwordHash: passwordData.hash,
			passwordSalt: passwordData.salt
		}

		const currentUser = await store.findOne({ username: req.body.username })
		if( !currentUser ) {
			const result = await store.insert( newUser )

			return res.json({ code: 'success', meta: { total: 1, count: 1 }, payload: result })
		} else {
			return res.json({ code: 'error', meta: {}, payload: { message: 'User already exists.' } })	
		}
		
	} catch( error ) {
		throw error
	}
}