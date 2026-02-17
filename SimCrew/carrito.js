let carrito = JSON.parse(localStorage.getItem('simcrew_carrito')) || [];

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarritoUI();
    
    const cartBtn = document.getElementById('carrito-contador');
    const overlay = document.getElementById('carrito-overlay');

    if (cartBtn) cartBtn.onclick = toggleCarrito;
    if (overlay) overlay.onclick = toggleCarrito; // Cierra al hacer clic fuera del drawer

    // Lógica para detectar categoría desde la URL (Específico para SimCrewCATALOGO.html)
    const urlParams = new URLSearchParams(window.location.search);
    const catFiltro = urlParams.get('cat');
    if (catFiltro) {
        const checkboxes = document.querySelectorAll('.filtro-cat');
        checkboxes.forEach(box => {
            if (box.value === catFiltro) {
                box.checked = true;
                box.dispatchEvent(new Event('change'));
            }
        });
    }
});

function guardarCarrito() {
    localStorage.setItem('simcrew_carrito', JSON.stringify(carrito));
}

function toggleCarrito() {
    const drawer = document.getElementById('carrito-drawer');
    const overlay = document.getElementById('carrito-overlay');
    if (drawer && overlay) {
        drawer.classList.toggle('translate-x-full');
        overlay.classList.toggle('hidden');
    }
}

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    guardarCarrito();
    actualizarCarritoUI();
    
    // Abre el carrito automáticamente para confirmar la acción al usuario
    const drawer = document.getElementById('carrito-drawer');
    if (drawer && drawer.classList.contains('translate-x-full')) {
        toggleCarrito();
    }
}

function actualizarCarritoUI() {
    const itemsContainer = document.getElementById('carrito-items');
    const contador = document.getElementById('carrito-contador');
    const totalElement = document.getElementById('carrito-total');

    if (contador) contador.innerText = `🛒 (${carrito.length})`;
    if (!itemsContainer) return;

    itemsContainer.innerHTML = '';
    
    if (carrito.length === 0) {
        itemsContainer.innerHTML = '<p class="text-gray-600 text-center mt-10 uppercase text-[10px] font-black italic">Tu carro está vacío</p>';
        if (totalElement) totalElement.innerText = '$0';
        return;
    }

    carrito.forEach((item, index) => {
        // Busca en productos.js (debe estar cargado en el HTML) para generar el link de detalle
        const infoProd = typeof productosDB !== 'undefined' ? productosDB.find(p => p.nombre === item.nombre) : null;
        const link = infoProd ? `SimCrewDETALLE.html?id=${infoProd.id}` : '#';

        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800 mb-3 animate-fadeIn';
        div.innerHTML = `
            <div>
                <a href="${link}" class="font-black text-[10px] uppercase text-white hover:text-orange-500 transition tracking-tighter">${item.nombre}</a>
                <p class="text-orange-500 font-black text-sm">$${item.precio.toLocaleString('es-CL')}</p>
            </div>
            <button onclick="eliminarItem(${index})" class="text-gray-600 hover:text-red-500 font-bold px-2 transition">✕</button>
        `;
        itemsContainer.appendChild(div);
    });

    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    if (totalElement) totalElement.innerText = `$${total.toLocaleString('es-CL')}`;
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarritoUI();
}

/**
 * Nueva función para redirigir a la página de Checkout
 */
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Añade productos antes de continuar.");
        return;
    }
    // Redirección a la página de check-in / datos de despacho
    window.location.href = "SimCrewCHECKOUT.html" + categoriaFiltro;
}
