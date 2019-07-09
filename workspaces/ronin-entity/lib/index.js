const ObjectID = require( 'mongodb' ).ObjectID

const database = require( 'ronin-database' )
const log = require( 'ronin-logger' )

class Entity {

	constructor( collection ) {
		this.collection = collection
		this.db = database.getConnection()
	}

	static ObjectID( value ) {
		return new ObjectID( value )
	}

	async aggregate( pipeline ) {
		try {
			const collection = await this.db.collection( this.collection )
			const results = await collection.aggregate( pipeline )
			
			return results.toArray()
		} catch( err ) {
			log.error( err )
			return err
		}
	}

	count( query ) {
		return this.db
			.collection( this.collection )
			.countDocuments( query )
			.then( results => {
				return results
			})

	}

	find( query, { sort = {}, project = {}, limit, skip } = {} ) {
		log.debug( `${this.collection}.find` )
		log.debug( JSON.stringify({ query, sort, project, limit, skip }) )

		if( (limit !== null && limit >= 0) && skip >= 0 ) {
			return this.db
				.collection( this.collection )
				.find( query )
				.sort( sort )
				.project( project )
				.skip( skip )
				.limit( limit )
				.toArray()
		}

		return this.db
			.collection( this.collection )
			.find( query )
			.sort( sort )
			.project( project )
			.toArray()
	}

	async findOne( query ) {
		try {
			const collection = await this.db.collection( this.collection )
			const result = await collection.findOne( query )

			return result
		} catch( error ) {
			throw error
		}
	}

	getById( id ) {
		return this.db
			.collection( this.collection )
			.findOne( { _id: new ObjectID( id ) } )
			.then( result => {
				return result
			})
	}

	insert( document ) {
		return this.db
			.collection( this.collection )
			.insertOne( document )
			.then( results => {
				return { insertedCount: results.insertedCount, insertedId: results.insertedId }
			})
	}

	updateById( id, update, withModifiers = false ) {
		let updateQuery = withModifiers ? update : { $set: update }
		
		delete update._id

		return this.db
			.collection( this.collection )
			.updateOne( { _id: new ObjectID( id ) }, updateQuery )
	}

	update( query, update, withModifiers = false ) {
		let updateQuery = withModifiers ? update : { $set: update }

		return this.db
			.collection( this.collection )
			.updateMany( query, updateQuery, { multi: true } )
	}

	updateOne( query, update, withModifiers = false ) {
		let updateQuery = withModifiers ? update : { $set: update }

		return this.db
			.collection( this.collection )
			.updateOne( query, updateQuery )
	}

	deleteById( id ) {
		return this.db
			.collection( this.collection )
			.deleteOne( { _id: new ObjectID( id ) } )	
	}

	delete( query ) {
		return this.db
			.collection( this.collection )
			.deleteOne( query )	
	}
}

module.exports = Entity




