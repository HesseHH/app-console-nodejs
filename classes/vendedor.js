const { v4: uuidv4 } = require('uuid');

class Vendedor {
    constructor( nombre ) {
        this.codigo = uuidv4();
        this.nombre = nombre;
    }
}

class Vendedores {
    constructor() {
        this.vendedores = {};
    }

    get getVendedoresArray() {
        const listado = [];

        Object.keys( this.vendedores ).forEach( vendedor => {
            listado.push( this.vendedores[ vendedor ] );
        });

        return listado;
    }

    registrarVendedor( nombre ) {
        const vendedor = new Vendedor( nombre );
        this.vendedores[ vendedor.codigo ] = vendedor;
    }

    cargarInfoVendedores( vendedores = [] ) {
        vendedores.forEach( data => {
            this.vendedores[ data.codigo ] = data;
        });
    }

    listaVendedores() {
        let i = 0;

        console.log();

        this.getVendedoresArray.forEach( ({ nombre }) => {
            i++;

            console.log(
                `${ i + '.' }`.brightYellow + ` ${ nombre }`.brightCyan
            );

        });
    }

    borrarVendedor( codigo = '' ) {
        if ( this.vendedores[ codigo ] ) {
            delete this.vendedores[ codigo ];
        }
    }

}

module.exports = { Vendedor, Vendedores };