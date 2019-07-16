const log = require( 'ronin-logger' )
const mongo = require( 'mongodb' ).MongoClient

let connections = {}

async function connect( url, name = 'default' ) {
	if ( connections[name] ) resolve( connections[name] )

	try {
		const db = await mongo.connect( url, { useNewUrlParser: true } )
		connections[name] = db.db()
		return db
	} catch( err ) {
		throw err
	}
}

function getConnection( name = 'default' ) {
	return connections[ name ]
}

module.exports = {
	connect,
	getConnection
}