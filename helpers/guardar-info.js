const fs = require('fs');

const guardarInfo = ( data, archivoPath ) => {
    fs.writeFileSync( archivoPath, JSON.stringify(data) );
}

const leerInfo = ( archivoPath ) => {
    if ( !fs.existsSync( archivoPath ) ) {
        return null;
    }

    const info = fs.readFileSync( archivoPath, { encoding: 'utf-8' } );
    const data = JSON.parse( info );

    return data;
}

module.exports = {
    guardarInfo,
    leerInfo
}