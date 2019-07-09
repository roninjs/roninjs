const config 		= require( './config' )
const log 			= require( 'ronin-logger' )
const strata 		= require( 'ronin-server' )
const mocks 		= require( 'ronin-mocks' )
const database 	= require( 'ronin-database' )

async function main() {
	
	try {
		await database.connect( config.database.connectionstring )

		const server = strata.server({
			port: config.server.port || 8080
		})

		server.use( '/services/m/', mocks.server( server.Router() ) )

		const result = await server.start()
		log.info( result )

	} catch( reason ) {
		log.error( reason )
	}

}

main()