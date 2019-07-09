const _ = require( 'lodash' )
const errors = require( 'restify-errors' )

const log = require( 'ronin-logger' )

let rbac = {}
function init( initRBAC ) {
	rbac = initRBAC
}

function authorizeRequest( permission, req, res, next ) {
	let permissionGranted = false
	const user = req.user

	const requestedPermisionSplit = permission.split( ':' )
	const requestedPermission = {
		entity: requestedPermisionSplit[0],
		permission: requestedPermisionSplit[1]
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
			return next( new errors.ForbiddenError() )
		}
		
	} catch( error ) {
		log.error( error )
		return next( new errors.InternalServerError() )
	}
}

const can = {
	create: ( entity ) => { return _.curry( authorizeRequest )( `${entity}:create` ) },
	read: 	( entity ) => { return _.curry( authorizeRequest )( `${entity}:read` ) },
	update: ( entity ) => { return _.curry( authorizeRequest )( `${entity}:update` ) },
	delete: ( entity ) => { return _.curry( authorizeRequest )( `${entity}:delete` ) }
}

module.exports = {
	init,
	can
}








