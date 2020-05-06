const moment 		= require( 'moment' )
const errors 		= require( 'ronin-errors' )
const pluralize = require( 'pluralize' )
const log 			= require( 'ronin-logger' )
const jwt				= require( 'jsonwebtoken' )

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
		const user = await store.findOne( query )

		let result = {}
		if( user ) {
			const passwordData = util.sha512( req.body.password, user.passwordSalt )
			if( user.passwordHash === passwordData.hash ) {
				const token = jwt.sign( JSON.stringify( {username: user.username, role: user.roles} ), req.context.secret )
				result = {
					status: 'success',
					meta: { total: total, count: total },
					payload: {
						jwt: token
					}
				}
			} else {
				return next(  errors.http.ForbiddenError('User is not authorized') )
			}

		} else {
			return next(  errors.http.ForbiddenError('User is not authorized') )
		}
		

		return res.json( result )

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
			passwordSalt: passwordData.salt,
			roles: req.body.roles
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