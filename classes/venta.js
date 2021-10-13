const { v4: uuidv4 } = require('uuid');


class Venta {
    constructor( cgVendedor, cgProducto = {}, total  ) {
        this.codigoVenta = uuidv4();
        this.cgVendedor = cgVendedor;
        this.cgProducto = cgProducto;
        this.fecha = new Date().toISOString();
        this.total = total;
    }
}

class Ventas {
    constructor() {
        this.ventas = {};
    }

    get getVentasArray() {
        const listado = [];

        Object.keys( this.ventas ).forEach( venta => {
            listado.push( this.ventas[ venta ] );
        });

        return listado;
    }

    registrarVenta( cgVendedor, cgProducto, total ) {
        const venta = new Venta( cgVendedor, cgProducto, total );
        this.ventas[ venta.codigoVenta ] = venta;
        console.log('se registro venta');
    }

    cargarInfoVentas( ventas = [] ) {
        ventas.forEach( data => {
            this.ventas[ data.codigoVenta ] = data;
        });
    }

    listaVentas( producto, vendedor ) {
        let j = 0;

        console.log();

        this.getVentasArray.forEach( ({ cgVendedor, cgProducto, fecha, total }) => {
            j++;
            const { nombre } = vendedor.vendedores[ cgVendedor ];
            const listadoProductos = [];
            Object.keys( cgProducto ).forEach( pr => {
                listadoProductos.push( cgProducto[ pr ] );
            });

            let namePriceCantidad = '';

            let i = 1;
            listadoProductos.forEach( ({ codigo, cantidad }) => {
                const { nombre, precio } = producto.productos[ codigo ];

                namePriceCantidad += `     ${ i + '.' } `.brightYellow 
                + `${ nombre } :: Precio: $${ precio } :: Cantidad vendida: ${ cantidad } :: `.brightCyan
                + `Total parcial: ${ parseInt(precio) * parseInt(cantidad) }\n`.brightCyan
                i++;
            })

            console.log();
            console.log(
                `${ j + '.' }`.brightYellow
                + `Vendedor:`.brightBlue + ` ${ nombre }\n`.brightCyan
                + `  Detalles:`.brightBlue + ` Fecha -> ${ fecha } :: Precio total -> ${ total }\n`.brightCyan
                + `  Productos vendidos:\n`.brightBlue
                + `${ namePriceCantidad }`
            );
        })

    }

    borrarVenta( codigo = '' ) {
        if ( this.ventas[ codigo ] ) {
            delete this.ventas[ codigo ];
        }
    }    
}

module.exports = { Venta, Ventas };