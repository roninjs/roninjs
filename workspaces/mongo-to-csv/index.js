const commandLineArgs = require('command-line-args')
const database  = require( 'ronin-database' )

const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'connectionstring', alias: 's', type: String },
  { name: 'collection', alias: 'c', type: String }
]

async function main() {
    if( !Array.isArray( data ) ) {
        throw new Error( "data must be an arry of objects." )
    }

    if( data.length <= 0 ) {
        throw new Error( "data must not be an empty array." )
    }
    
    const options = commandLineArgs(optionDefinitions)

    await database.connect( config.database.connectionstring )

    let output = ''

    const keys = Object.keys( data[0] )
    keys.forEach( key => {
        output += `${key},`
    })

    output = output.substring(0, output.length-1)
    output += '\n'
    
    data.forEach( item => {
        let line = ''
        keys.forEach( key => {
            let value = `${item[key] || ''}`
            if( item[key] && typeof item[key] === `boolean` ) {
                value = item[key]+''
            } else if( item[key] && typeof item[key] !== `string` ) {
                value = `${item[key].name || item[key].key || ''}`
            }
            line += value.replace( ',', '') + ','
        })
        output += line.substring(0, line.length-1)
        output += '\n'
    })

    console.log( output )
}

main()