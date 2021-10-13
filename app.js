const Tienda = require("./classes/tienda");
const { 
    menuPrincipal,
    pausa, 
    obtenerInfo,
    elegirInfoV, 
    elegirInfoP, 
    inquirerObtenerCantidad, 
    menuBorrar, 
    listaBorrarProducto, 
    confirmar, 
    listaBorrarVendedor,
    listaBorrarVenta,
    menuModificar,
    modificarVendedor,
    modificarNombreProducto,
    modificarStockProducto} = require("./helpers/inquire");
const { Productos } = require('./classes/producto');
const { guardarInfo, leerInfo } = require("./helpers/guardar-info");
const { Ventas } = require("./classes/venta");
const { Vendedores } = require("./classes/vendedor");


const main = async() => {

    let opt = '';

    const archivos = ['./db/productos.json', './db/ventas.json', './db/vendedores.json'];

    const tienda = new Tienda();
    const p = new Productos();
    const vt = new Ventas();
    const vd = new Vendedores();

    readInfo( archivos[0], 1, p );
    readInfo( archivos[1], 2, vt );
    readInfo( archivos[2], 3, vd );

    // const pr = leerInfo();
    // if ( pr ) {
    //     p.cargarInfoProductos( pr );
    // }    

    do {
        opt = await menuPrincipal();

        switch ( opt ) {
            case '1':
                //Registrar Producto

                const nombre = await obtenerInfo('Ingrese el nombre del producto:');
                const precio = await obtenerInfo('Ingrese el precio del producto:');
                const stock = await obtenerInfo('Ingrese el stock del producto:');

                p.registrarProducto( nombre, precio, parseInt(stock) );

                break;
            case '2':
                //Realizar Venta

                const codigosP = await elegirInfoP( p.getProductosArray );
                const [ codigoV ] = await elegirInfoV( vd.getVendedoresArray );
                const [ prs, total ] = await obtenerCantidadyTotal( codigosP, p );
                vt.registrarVenta( codigoV, prs, total );

                break;
            case '3':
                //Registrar Vendedor

                const nombreV = await obtenerInfo('Ingrese nombre de vendedor:');
                vd.registrarVendedor( nombreV );

                break;
            case '4':
                //Modificar Producto
                let optn = '';
                do {
                    optn = await menuModificar();
                    switch ( optn ) {
                        case '1':
                            await modificarNombreProducto( p.getProductosArray, p ).catch();
                            guardarInfo( p.getProductosArray, archivos[0] );
                            break;
                        case '2':
                            await modificarStockProducto( p.getProductosArray, p );
                            guardarInfo( p.getProductosArray, archivos[0] );
                            break;
                        case '3':
                            await modificarVendedor( vd.getVendedoresArray, vd );
                            guardarInfo( vd.getVendedoresArray, archivos[2] );
                            break;
                    }
                } while ( optn != '0' );
                break;
            case '5':
                //Borrar Datos
                let opcion = ''
                do {
                    opcion = await menuBorrar();
                    switch ( opcion ) {
                        case '1':
                            const codigo = await listaBorrarProducto( p.getProductosArray );
                            if ( codigo != 0 ) {
                                const ok = await confirmar('¿Estás seguro?');
                                if ( ok ) {
                                    p.borrarProducto( codigo );
                                    guardarInfo( p.getProductosArray, archivos[0] );
                                }
                            }
                            break;
                        case '2':
                            const codigo3 = await listaBorrarVenta( vt.getVentasArray, p, vd );
                            if ( codigo3 != 0 ) {
                                const ok = await confirmar('¿Estás seguro?');
                                if ( ok ) {
                                    vt.borrarVenta( codigo3 );
                                    guardarInfo( vt.getVentasArray, archivos[1] );
                                }
                            }
                            break;
                        case '3':
                            const codigo2 = await listaBorrarVendedor( vd.getVendedoresArray );
                            if ( codigo2 != 0 ) {
                                const ok = await confirmar('¿Estás seguro?');
                                if ( ok ) {
                                    vd.borrarVendedor( codigo2 );
                                    guardarInfo( vd.getVendedoresArray, archivos[2] );
                                }
                            }
                            break;
                    }

                } while ( opcion != '0' );

                break;
            case '6':
                //Lista Productos
                p.listaProductos();
                break;
            case '7':
                //Lista Ventas
                vt.listaVentas( p, vd );
                break;
            case '8':
                //Lista Vendedores
                vd.listaVendedores();
                break;
        }

        guardarInfo( p.getProductosArray, archivos[0] );
        guardarInfo( vt.getVentasArray, archivos[1] );
        guardarInfo( vd.getVendedoresArray, archivos[2] );

        await pausa();

    } while ( opt != 0 );

}


const readInfo = async( infoPath, i, objeto ) => {
    const array = leerInfo( infoPath );

    if ( array ) {
        switch ( i ) {
            case 1:
                objeto.cargarInfoProductos( array );
                break;
            case 2:
                objeto.cargarInfoVentas( array );
                break;
            case 3:
                objeto.cargarInfoVendedores( array );
                break;
        }
    }
}

const obtenerCantidadyTotal = async( arrayCodigos = [], objProducto ) => {
    let prArray = [];
    let codigoCanditad = {};
    arrayCodigos.forEach( codigo => {

        console.log('======', objProducto.productos[ codigo ]);

        const pr = objProducto.productos[ codigo ];
        codigoCanditad[ codigo ] = {
            codigo: codigo,
            cantidad: null
        };
        prArray.push( pr );
    });

    let totalParcial = 0;
    let totalFinal = 0

    for (let i = 0; i < prArray.length; i++) {
        const { codigo, nombre, precio, stock } = prArray[ i ];
        const msg = `Ingrese la cantidad de productos ` 
        + `"${ nombre }"`.brightYellow 
        + ` (stock: ${ stock } :: precio: %${ precio })`.cyan + `:`;

        const cantidad = await inquirerObtenerCantidad( msg, stock );
        totalParcial = parseInt( precio ) * parseInt( cantidad );
        totalFinal += totalParcial;

        codigoCanditad[ codigo ].cantidad = parseInt(cantidad);
        
        objProducto.productos[ codigo ].stock -= cantidad;
    }

    
    
    
    return [ codigoCanditad, totalFinal ];
}

main();