const config    = require( './config' )
const ronin 	= require( 'ronin-server' )
const database  = require( 'ronin-database' )
const mocks     = require( 'ronin-mocks' )

async function main() {
	
	try {

    await database.connect( config.database.connectionstring )

		const server = ronin.server({
			port: config.server.port || 8080
		})

    server.use( '/services/', mocks.server( server.Router() ) )

		const result = await server.start()
		console.log( result )

	} catch( reason ) {
    	console.error( reason.stack || reason )
	}

}

main()