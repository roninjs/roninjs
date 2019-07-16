const errors = require( 'restify-errors' )
const jwt = require( 'jsonwebtoken' )
const Cookies = require( 'cookies' )


const Entity = require( 'ronin-entity' )
const log = require( 'ronin-logger' )

let config = {
  usersCollection: null
}

const status = {
  AUTHENTICATED: 0,
  UNAUTHORIZED: 100,
  FORBIDDEN: 101  
}

function init( usersCollection ) {
  log.info( 'security.init' )
  log.debug( `usersCollection: ${usersCollection}` )

  config.usersCollection = usersCollection
}

function getAuthToken( req, res ) {
  log.info( 'security.getAuthToken' )

	let token = req.header( 'authorization' )
	if( token ) {
    log.info( 'token found in header' )
		token = token.replace( 'Bearer', '' ).trim()
	} else {
    log.info( 'token found in cookies' )
		const cookies = new Cookies( req, res )
		token = cookies.get( 'ronin-tks' )
	}

	return token
}

async function authenticate( secret, req, res, next ) {
  log.info( `security.authenticate` )

  let token = getAuthToken( req, res )
  if( token ) {

    log.info( 'verify token' )
    return jwt.verify( token, secret, async ( err, jwtPayload ) => {
      if ( err ) {
        log.warn( 'invalid token' )
        log.debug( err )
        return status.UNAUTHORIZED

      } else {
        log.info( 'valid token' )
        const users = new Entity( config.usersCollection )
        const query = { username: jwtPayload.preferred_username }

        let userData = await users.aggregate( query )
        if( userData && userData.length ) {
          log.info( 'user found' )
          log.debug( userData )
          req.user = userData[0]

          return status.AUTHENTICATED
        } else {
          log.info( `${jwtPayload.preferred_username} was not found in users collection: ${config.usersCollection}` )

          return status.FORBIDDEN
        }

      }
    })

  } else {
    log.info( 'Invalid credentials' )
    return status.UNAUTHORIZED
  }
}

module.exports = {
  init,
  status,
  authenticate
}