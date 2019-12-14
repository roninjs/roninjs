const _ = require( 'lodash' )
const log = require( 'ronin-logger' )
const pluralize = require( 'pluralize' )
const errors = require( 'ronin-errors' )
const Entity = require( 'ronin-entity' )
const security = require( './security' )

let secret
let rbac = {}

function init( config ) {
	log.info( `rbac.init` )
	secret = config.secret
	rbac = config.permissions

	security.init( config.usersCollection )
}

async function authorizeRequest( permission, req, res, next ) {
	log.info( `rbac.authorizeRequest` )
	let permissionGranted = false

	const authenticatedStatus = await security.authenticate( secret, req, res, next )
	if( authenticatedStatus === security.status.AUTHENTICATED ) {
		const user = req.user
		log.info( `user '${user.username}' has been authenticated` )
		log.debug( user )

		const requestedPermisionSplit = permission.split( ':' )
		let requestedPermission = {
			entity: requestedPermisionSplit[0],
			permission: requestedPermisionSplit[1]
		}

		if( requestedPermission.entity === '@' ) {
			requestedPermission.entity = getCollectionName( req )
		}

		try {
			user.roles.forEach( userRole => {
				const rolePermissions = rbac[ userRole ]

				rolePermissions.forEach( rolePermission => {
				
					if( rolePermission.entity === requestedPermission.entity || rolePermission.entity === '*' ) {

						rolePermission.permissions.forEach( p => {
							if( requestedPermission.permission === p || p === '*' ) {
								permissionGranted = true
							}
						})

					}

				})
			})

			if( permissionGranted ) {
				return next()	
			} else {
				return next( errors.http.ForbiddenError() )
			}
			
		} catch( error ) {
			log.error( error )
			return next( errors.server.InternalServerError() )
		}
	} else {
		if( authenticatedStatus === security.status.UNAUTHORIZED ) {
			return next( errors.http.UnauthorizedError('User is not authenticated') )
		} else {
			return next(  errors.http.ForbiddenError('User is not authorized') )
		}
	}
}

function getCollectionName( req ) {
	let collection = req.params.entity
	if( collection ) {
		collection = pluralize.plural( collection )	
	}

	return collection
}

const can = {
	create: ( entity = '@' ) => { return _.curry( authorizeRequest )( `${entity}:create` ) },
	read: 	( entity = '@' ) => { return _.curry( authorizeRequest )( `${entity}:read` ) },
	update: ( entity = '@' ) => { return _.curry( authorizeRequest )( `${entity}:update` ) },
	delete: ( entity = '@' ) => { return _.curry( authorizeRequest )( `${entity}:delete` ) }
}

module.exports = {
	init,
	can
}
