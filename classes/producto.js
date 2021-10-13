const { v4: uuidv4 } = require('uuid');
const colors = require('colors');

colors.setTheme({
    custom: ['brightBlue', 'underline']
});


class Producto {

    constructor( nombre, precio, stock ) {
        this.codigo = uuidv4();
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

}

class Productos {

    constructor() {
        this.productos = {};
    }

    get getProductosArray() {
        const listado = [];
        Object.keys( this.productos ).forEach( producto => {
            listado.push( this.productos[ producto ] );
        });

        return listado;
    }

    registrarProducto( nombre, precio, stock ) {
        const producto = new Producto( nombre, precio, stock );
        this.productos[ producto.codigo ] = producto;
    }

    cargarInfoProductos( productos = [] ) {
        productos.forEach( data => {
            this.productos[ data.codigo ] = data;
        })
    }

    listaProductos() {
        let i = 0;

        console.log();
        console.log('---> '.brightBlue + 'Nombre :: precio :: stock'.custom);
        console.log();

        this.getProductosArray.forEach( ({ nombre, precio, stock }) => {
            i++;

            const stockBien = `${ stock }`.brightCyan + ` -> Bien`.green;
            const stockMal  = `${ stock }`.brightCyan + ` -> Escaso`.brightRed;

            console.log(
                `${ i + '.' } `.brightYellow
                + `${ nombre } :: `.brightCyan 
                + `$${ precio } :: `.brightCyan 
                + `${ (stock > 25) ? `${ stockBien }` : `${ stockMal }` }`
            );

        });
    }

    borrarProducto( codigo = '' ) {
        if ( this.productos[ codigo ] ) {
            delete this.productos[ codigo ];
        }
    }

}


module.exports = {
    Producto,
    Productos
};