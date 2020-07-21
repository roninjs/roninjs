const ronin 		= require( 'ronin-server' )
const mocks 		= require( 'ronin-mocks' )

// const database  = require( 'ronin-database' )
// const config    = require( './config' )

async function main() {

	try {

    // await database.connect( config.database.connectionstring )

    const server = ronin.server({
			port: 8080
		})

		server.use( '/services/m/', mocks.server( server.Router(), false, true ) )

    const result = await server.start()
    console.info( result )

	} catch( error ) {
		console.error( error )
	}

}

main()
