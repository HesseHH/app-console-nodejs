const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        pageSize: 9,
        choices: [
            { value: '1', name: `${ '1.'.brightYellow } Registrar producto` },
            { value: '2', name: `${ '2.'.brightYellow } Realizar venta` },
            { value: '3', name: `${ '3.'.brightYellow } Registrar vendedor` },
            { value: '4', name: `${ '4.'.brightYellow } Modificar producto` },
            { value: '5', name: `${ '5.'.brightYellow } Borrar datos` },
            { value: '6', name: `${ '6.'.brightYellow } Lista de productos` },
            { value: '7', name: `${ '7.'.brightYellow } Lista de ventas` },
            { value: '8', name: `${ '8.'.brightYellow } Lista de vendedores` },
            { value: '0', name: `${ '0.'.brightYellow } Salir` }
        ]
    }
];

const menuPrincipal = async() => {
    console.clear();
    console.log('=========================='.brightGreen);
    console.log('  Seleccione una opción'.brightGreen);
    console.log('=========================='.brightGreen);

    const { opcion } = await inquirer.prompt( preguntas );
    return opcion;
}

const pausa = async() => {
    const pauseInput = [
        {
            type: 'input',
            name: 'opt',
            message: `Presione ${ 'ENTER'.yellow } ${ 'para continuar'.brightBlue }`.blue
        }
    ];

    console.log();
    await inquirer.prompt( pauseInput );
}

const obtenerInfo = async( message = '', i = 0 ) => {
    const pregunta = [
        {
            type: 'input',
            name: 'valor',
            message,
            validate( value) {
                if ( value.length === 0 ) {
                    return 'Por favor ingrese un valor'.brightRed;
                }
                return true;
            }
        }
    ];

    const { valor } = await inquirer.prompt( pregunta );
    return valor;
}

const elegirInfoV = async( arrayProductos = [] ) => {
    let i = 0;
    const choices = arrayProductos.map( ({ codigo, nombre }) => {
        i++;

        return {
            value: codigo,
            name: `${ i + '.'.brightYellow } ${ nombre }`
        }
    });

    const questions= [
        {
            type: 'checkbox',
            name: 'codigos',
            message: 'Selecciones',
            choices,
            validate( value ) {
                if ( value.length > 1 || value.length <= 0 ) {
                    return 'Asegúrese de seleccionar solo un(a) vendedor(a).'.brightRed
                }
                return true;
            }
        }
    ];

    const { codigos } = await inquirer.prompt( questions );

    return codigos;
}

const elegirInfoP = async( arrayVentas = [] ) => {
    let i = 0;
    const choices = arrayVentas.map( ({ codigo, nombre, precio }) => {
        i++;

        return {
            value: codigo,
            name: `${ i + '.' }`.brightYellow + ` ${ nombre } - $${ precio }`
        };
    });

    const questions= [
        {
            type: 'checkbox',
            name: 'codigos',
            message: 'Selecciones',
            choices,
            validate( value ) {
                if ( value.length <= 0 ) {
                    return 'Debe seleccionar mínimo 1 producto.'.brightRed
                }
                return true
            }
        }
    ];

    const { codigos } = await inquirer.prompt( questions );

    return codigos;
}

const listaBorrarProducto = async( arrayVentas = [] ) => {
    let i = 0;
    const choices = arrayVentas.map( ({ codigo, nombre, precio }) => {
        i++;

        return {
            value: codigo,
            name: `${ i + '.' }`.brightYellow + ` ${ nombre } - $${ precio }`
        };
    });

    choices.unshift({
        value: 0,
        name: `${ '0.'.brightYellow } Cancelar`
    });

    const questions= [
        {
            type: 'list',
            name: 'codigos',
            message: 'Seleccion un producto para borrar',
            choices
        }
    ];

    const { codigos } = await inquirer.prompt( questions );

    return codigos;
}

const listaBorrarVendedor = async( arrayProductos = [] ) => {
    let i = 0;
    const choices = arrayProductos.map( ({ codigo, nombre }) => {
        i++;

        return {
            value: codigo,
            name: `${ i + '.' }`.brightYellow + ` ${ nombre }`
        }
    });

    choices.unshift({
        value: 0,
        name: `${ '0.'.brightYellow } Cancelar`
    });

    const questions= [
        {
            type: 'list',
            name: 'codigos',
            message: 'Seleccione un vendedor para borrar',
            choices
        }
    ];

    const { codigos } = await inquirer.prompt( questions );

    return codigos;
}

const listaBorrarVenta = async( arrayVenta = [], producto, vendedor ) => {
    let j = 0;

    console.log();

    const choices = arrayVenta.map( ({ codigoVenta, cgVendedor, cgProducto, fecha, total }) => {
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

        const name = `${ j + '.' } `.brightYellow
        + `Vendedor:`.brightBlue + ` ${ nombre } | `
        + `Detalles:`.brightBlue + ` Fecha -> ${ fecha } :: Precio total -> ${ total }`;

        return {
            value: codigoVenta,
            name
        };
    });

    choices.unshift({
        value: 0,
        name: `${ '0.'.brightYellow } Cancelar`
    });

    const questions = [
        {
            type: 'list',
            name: 'codigo',
            message: 'Seleccione una venta para borrar',
            choices
        }
    ];

    const { codigo } = await inquirer.prompt( questions );
    return codigo;

}

const modificarVendedor = async(  arrayVendedor = [], arrayObjVendedor ) => {
    const codigo = await listaBorrarVendedor( arrayVendedor );
    const v = arrayObjVendedor.vendedores[ codigo ];

    if ( v ) {
        const question = [
            {
                type: 'input',
                name: 'nombre',
                message: `Ingrese un nombre nuevo(nombre actual: ` + `${ v.nombre })`.brightCyan + `:`,
                validate( value) {
                    if ( value.length === 0 ) {
                        return 'Por favor ingrese un valor'.brightRed;
                    }
                    return true;
                }
            }
        ];
    
        const { nombre } = await inquirer.prompt( question );
    
        const ok = await confirmar('¿Está sefuro de modificar nombre de vendedor?');
        if ( ok ) {
            v.nombre = nombre;
        }
    }
}

const modificarNombreProducto = async(  arrayProductos = [], arrayObjProducto ) => {
    const codigo = await listaBorrarVendedor( arrayProductos );
    const p = arrayObjProducto.productos[ codigo ];

    if ( p ) {
        const question = [
            {
                type: 'input',
                name: 'nombre',
                message: `Ingrese un nombre nuevo(nombre actual: ` + `${ p.nombre })`.brightCyan + `:`,
                validate( value) {
                    if ( value.length === 0 ) {
                        return 'Por favor ingrese un valor'.brightRed;
                    }
                    return true;
                }
            }
        ];
    
        const { nombre } = await inquirer.prompt( question );
    
        const ok = await confirmar(`¿Está sefuro de modificar nombre de producto?`);
        if ( ok ) {
            p.nombre = nombre;
        }
    }
}

const modificarStockProducto = async(  arrayProductos = [], arrayObjProducto ) => {
    const codigo = await listaBorrarVendedor( arrayProductos );
    const p = arrayObjProducto.productos[ codigo ];

    if ( p ) {
        const question = [
            {
                type: 'input',
                name: 'stock',
                message: `Ingrese un stock nuevo(nombre: ` + `${ p.nombre }`.brightCyan + ` - stock: ` + `${ p.stock })`.brightCyan + `:`,
                validate( value) {
                    if ( value.length === 0 ) {
                        return 'Por favor ingrese un valor'.brightRed;
                    }
                    return true;
                }
            }
        ];
    
        const { stock } = await inquirer.prompt( question );
    
        const ok = await confirmar(`¿Está sefuro de modificar stock?`);
    
        if ( ok ) {
            p.stock = stock
        }
    }    

}

const menuBorrar = async() => {
    console.clear();
    console.log('=========================='.brightGreen);
    console.log('  Seleccione una opción'.brightGreen);
    console.log('=========================='.brightGreen);
    const questions = [
        {
            type: 'list',
            name: 'opcion',
            message: 'Seleccione qué desea borrar',
            choices: [
                { value: '1', name: `${ '1.'.brightYellow } Borrar Productos`},
                { value: '2', name: `${ '2.'.brightYellow } Borrar Ventas`},
                { value: '3', name: `${ '3.'.brightYellow } Borrar Vendedores`},
                { value: '0', name: `${ '0.'.brightYellow } Cancelar`}
            ]
        }
    ];

    const { opcion } = await inquirer.prompt( questions );
    return opcion;
}

const menuModificar = async() => {
    console.clear();
    console.log('=========================='.brightGreen);
    console.log('  Seleccione una opción'.brightGreen);
    console.log('=========================='.brightGreen);
    const questions = [
        {
            type: 'list',
            name: 'opcion',
            message: 'Seleccione qué desea modificar',
            choices: [
                { value: '1', name: `${ '1.'.brightYellow } Modificar nombre de producto`},
                { value: '2', name: `${ '2.'.brightYellow } Modificar stock de producto`},
                { value: '3', name: `${ '3.'.brightYellow } Modificar nombre de vendedor`},
                { value: '0', name: `${ '4.'.brightYellow } Cancelar`}
            ]
        }
    ];

    const { opcion } = await inquirer.prompt( questions );
    return opcion;
}

const confirmar = async( message ) => {
    
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];
    
    const { ok } = await inquirer.prompt( question );
    return ok;
    
}

const inquirerObtenerCantidad = async( message, stock ) => {
    const question = [
        {
            type: 'input',
            name: 'cantidad',
            message,
            validate( value) {
                if ( value.length === 0 ) {
                    return 'Por favor ingrese un valor'.brightRed;
                }
                if ( value > stock ) {
                    return 'Cantidad excedida. Asegúrese de ingresar una cantidad dentro del rango.'.brightRed;
                }
                return true;
            }
        }
    ];

    const { cantidad } = await inquirer.prompt( question );
    return cantidad;
}

module.exports = {
    menuPrincipal,
    pausa,
    obtenerInfo,
    elegirInfoP,
    elegirInfoV,
    inquirerObtenerCantidad,
    listaBorrarProducto,
    menuBorrar,
    confirmar,
    listaBorrarVendedor,
    listaBorrarVenta,
    menuModificar,
    modificarVendedor,
    modificarNombreProducto,
    modificarStockProducto
}
