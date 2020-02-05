const ronin 		= require( 'ronin-server' )
const mocks 		= require( 'ronin-mocks' )

const server = ronin.server()

server.use( '/services/m/', mocks.server( server.Router() ) )

server
	.start( result => console.log( result ) )
	.catch( reason => console.error( reason ) )
