'use strict';
//Ventana Carrito
const ventanaCarrito = document.getElementById('ventanaCarrito');
const closeVentanaCarrito = document.getElementById('cerrar-ventanaCarrito');
const btnPagar = document.getElementById('btn-RealizarCompra');

function cerrarVentana() {
    ventanaCarrito.style.display = 'none';
}

function abrirVentana() {
    ventanaCarrito.style.display = 'block';
}

function mostrarBtnPagar(){
    btnPagar.style.display = 'block';
    btnPagar.style.marginLeft= '60px';
    
}

const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById("template-product").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

//Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        imprimirCarrito();
    }
});
//Para capturar el elemento a modificar mediante un evento
cards.addEventListener('click', elemento => {
    addCarrito(elemento);
});
//Añadir o disminuir cantidad de un producto
items.addEventListener('click', elemento => {
    btnAction(elemento);
});

//Traer productos del JSON
const fetchData = async () => {
    try {
        const res = await fetch('../json/productos.json');
        const data = await res.json();
        //console.log(data);
        llenarProductos(data);
    } catch (error) {
        console.log(error);

    }
};

//Llenar productos obtenidos del JSON al templeate
const llenarProductos = data => {
    console.log(data);
    data.forEach(producto => {
        //  console.log(producto);
        templateCard.querySelector('h3').textContent = producto.title;
        templateCard.querySelector('span').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute("src", producto.imagen);
        templateCard.querySelector('i').dataset.id = producto.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);

    });

    cards.appendChild(fragment);
};

//para añadir al carrito un elemento al darclik
const addCarrito = elemento => {
    //console.log(elemento.target);//todos los elementos
    //console.log(elemento.target.classList.contains('product__icon'));//devuelve true si es el iconCarrito
    if (elemento.target.classList.contains('product__icon')) {
        setCarrito(elemento.target.parentElement);//el parametro ingresado es para acceder a todo el div que contiene el producto
        abrirVentana(); //abre ventana carrito
        mostrarBtnPagar();
       

    }
    elemento.stopPropagation();//Para evitar que propagen los eventos del contenedor padre

};

const setCarrito = objeto => {
    console.log(objeto);
    const producto = {
        id: objeto.querySelector('.product__icon').dataset.id,
        title: objeto.querySelector('h3').textContent,
        precio: objeto.querySelector('span').textContent,
        cantidad: 1
    };

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = { ...producto };
    imprimirCarrito();
    // console.log(producto);
    //console.log(carrito);
};

const imprimirCarrito = () => {
    console.log(carrito);
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id; //del producto que craamos no del .json
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
       templateCarrito.querySelectorAll('span')[0].textContent = producto.precio;
        //templateCarrito.querySelectorAll('td')[1].textContent = producto.precio;
        templateCarrito.querySelectorAll('td')[2].textContent = producto.cantidad;
        templateCarrito.querySelector('.carrito__item-bontones--aumentarCantidad').dataset.id = producto.id;
        templateCarrito.querySelector('.carrito__item-bontones--disminuirCantidad').dataset.id = producto.id;
        templateCarrito.querySelectorAll('span')[1].textContent = producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    pintarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const pintarFooter = () => {
    footer.innerHTML = '';

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = ` <th scope="row" colspan="6">Carrito vacío. Seleccione los productos a comprar!</th>`;
        btnPagar.style.display = 'none';
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0);
    console.log(`Cantidad Productos: ${nCantidad}`);
    console.log(`Total a Pagar: ${nPrecio}`);


    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', () => {
        carrito = {};
        imprimirCarrito();

    });
};


const btnAction = elemento => {
    //console.log(elemento.target); devuelve el elemnto de la tabla carrito al cual se hace click

    if (elemento.target.classList.contains('carrito__item-bontones--aumentarCantidad')) {

        //Acción de aumentar
        console.log(carrito[elemento.target.dataset.id]);

        const producto = carrito[elemento.target.dataset.id];
        producto.cantidad++;
        carrito[elemento.target.dataset.id] = { ...producto };
        imprimirCarrito();
    }

    if (elemento.target.classList.contains('carrito__item-bontones--disminuirCantidad')) {
        //Acción de aumentar
        console.log(carrito[elemento.target.dataset.id]);

        const producto = carrito[elemento.target.dataset.id];
        producto.cantidad--;

        if (producto.cantidad === 0) {
            delete carrito[elemento.target.dataset.id];

        }

        imprimirCarrito();
    }

    elemento.stopPropagation();

};

