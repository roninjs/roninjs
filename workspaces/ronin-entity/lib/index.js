const ObjectID = require( 'mongodb' ).ObjectID

const database = require( 'ronin-database' )
const log = require( 'ronin-logger' )

class Entity {

	constructor( collection ) {
		this.collection = collection
	}

	static ObjectID( value ) {
		return new ObjectID( value )
	}

	async initConnection() {
		if( !this.db ) {
			this.db = await database.getConnection()
		}
		return this.db
	}

	async aggregate( pipeline ) {
		await this.initConnection()

		try {
			const collection = await this.db.collection( this.collection )
			const results = await collection.aggregate( pipeline )
			
			return results.toArray()
		} catch( err ) {
			log.error( err )
			return err
		}
	}

	async count( query ) {
		await this.initConnection()

		return this.db
			.collection( this.collection )
			.countDocuments( query )
			.then( results => {
				return results
			})

	}

	async find( query, { sort = {}, project = {}, limit, skip } = {} ) {
		await this.initConnection()
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
		await this.initConnection()
		try {
			const collection = await this.db.collection( this.collection )
			const result = await collection.findOne( query )

			return result
		} catch( error ) {
			throw error
		}
	}

	async getById( id ) {
		await this.initConnection()
		return this.db
			.collection( this.collection )
			.findOne( { _id: new ObjectID( id ) } )
			.then( result => {
				return result
			})
	}

	async insert( document ) {
		await this.initConnection()
		return this.db
			.collection( this.collection )
			.insertOne( document )
			.then( results => {
				return { insertedCount: results.insertedCount, insertedId: results.insertedId }
			})
	}

	async updateById( id, update, withModifiers = false ) {
		await this.initConnection()
		let updateQuery = withModifiers ? update : { $set: update }
		
		delete update._id

		return this.db
			.collection( this.collection )
			.updateOne( { _id: new ObjectID( id ) }, updateQuery )
	}

	async update( query, update, withModifiers = false ) {
		await this.initConnection()
		let updateQuery = withModifiers ? update : { $set: update }

		return this.db
			.collection( this.collection )
			.updateMany( query, updateQuery, { multi: true } )
	}

	async updateOne( query, update, withModifiers = false ) {
		await this.initConnection()
		let updateQuery = withModifiers ? update : { $set: update }

		return this.db
			.collection( this.collection )
			.updateOne( query, updateQuery )
	}

	async deleteById( id ) {
		await this.initConnection()
		return this.db
			.collection( this.collection )
			.deleteOne( { _id: new ObjectID( id ) } )	
	}

	async delete( query ) {
		await this.initConnection()
		return this.db
			.collection( this.collection )
			.deleteOne( query )	
	}
}

module.exports = Entity




