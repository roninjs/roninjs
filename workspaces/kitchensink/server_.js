const ronin 		= require( 'ronin-server' )
const mocks 		= require( 'ronin-mocks' )

async function main() {
	const server = ronin.server()

	server.use( '/services/m/', mocks.server( server.Router() ) )

	try {
		
		const result = await server.start()
		console.info( result )

	} catch( error ) {
		console.error( reason )
	}

}

main()
