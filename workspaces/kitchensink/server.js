const config 		= require( './config' )
const log 			= require( 'ronin-logger' )
const ronin 		= require( 'ronin-server' )
const mocks 		= require( 'ronin-mocks' )
const database 		= require( 'ronin-database' )
const auth			= require( 'ronin-auth' )
const rbac			= require( 'ronin-rbac' )

async function main() {
	
	try {
		await database.connect( config.database.connectionstring )

		const server = ronin.server({
			port: config.server.port || 8080
		})

		auth.init({
			secret: config.rbac.secret,
			usersCollection: config.rbac.usersCollection
		})

		rbac.init({	
			secret: config.rbac.secret,
			usersCollection: config.rbac.usersCollection,
			permissions: {
				"admin": [{
					"entity": "*",
					"permissions": [ "*" ]
				}],
				"read-only": [{
					"entity": "*",
					"permissions": [ "read" ]
				}]
			}
		})

		server.use( '/services/m/auth', auth.server( server.Router(), rbac ) )
		server.use( '/services/m/', mocks.server( server.Router() ) )

		const result = await server.start()
		log.info( result )

	} catch( reason ) {
		log.error( reason )
	}

}

main()