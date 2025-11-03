// JavaScript completo extraído de templates/index.html (sin eliminar nada)
// Base de datos de productos
const products = [
	// Ropa Mujer
	{ id: 1, name: 'Leggings Deportivos', brand: 'Nike', price: 45.00, category: 'mujer', image: 'https://images.unsplash.com/photo-1506629905607-45e5e6aa4b5b?w=300&h=300&fit=crop', rating: 4.8, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Negro', 'Gris'], popular: true },
	{ id: 2, name: 'Top Deportivo', brand: 'Adidas', price: 35.00, category: 'mujer', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop', rating: 4.6, sizes: ['XS', 'S', 'M', 'L'], colors: ['Rosa', 'Negro'], popular: false },
	{ id: 3, name: 'Chaqueta Running', brand: 'Puma', price: 75.00, category: 'mujer', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop', rating: 4.7, sizes: ['S', 'M', 'L', 'XL'], colors: ['Azul', 'Negro'], popular: true },
	{ id: 4, name: 'Shorts Deportivos', brand: 'Under Armour', price: 28.00, category: 'mujer', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop', rating: 4.5, sizes: ['XS', 'S', 'M', 'L'], colors: ['Negro', 'Gris'], popular: false },
  
	// Ropa Hombre
	{ id: 5, name: 'Camiseta Dry-Fit', brand: 'Nike', price: 32.00, category: 'hombre', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', rating: 4.9, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Azul', 'Negro', 'Blanco'], popular: true },
	{ id: 6, name: 'Pantalón Jogger', brand: 'Adidas', price: 55.00, category: 'hombre', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop', rating: 4.6, sizes: ['S', 'M', 'L', 'XL'], colors: ['Negro', 'Gris'], popular: true },
	{ id: 7, name: 'Sudadera Capucha', brand: 'Puma', price: 68.00, category: 'hombre', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop', rating: 4.7, sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Negro', 'Gris', 'Azul'], popular: false },
	{ id: 8, name: 'Shorts Training', brand: 'Under Armour', price: 38.00, category: 'hombre', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop', rating: 4.4, sizes: ['S', 'M', 'L', 'XL'], colors: ['Negro', 'Azul'], popular: false },
  
	// Ropa Niños
	{ id: 9, name: 'Conjunto Deportivo', brand: 'Nike', price: 42.00, category: 'niños', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=300&h=300&fit=crop', rating: 4.8, sizes: ['XS', 'S', 'M'], colors: ['Azul', 'Rosa'], popular: true },
	{ id: 10, name: 'Camiseta Fútbol', brand: 'Adidas', price: 25.00, category: 'niños', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', rating: 4.6, sizes: ['XS', 'S', 'M'], colors: ['Rojo', 'Azul'], popular: false },
	{ id: 11, name: 'Zapatillas Kids', brand: 'Puma', price: 48.00, category: 'niños', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', rating: 4.7, sizes: ['28', '30', '32', '34'], colors: ['Rosa', 'Azul'], popular: true },
  
	// Accesorios
	{ id: 12, name: 'Gorra Deportiva', brand: 'Nike', price: 22.00, category: 'accesorios', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop', rating: 4.5, sizes: ['Única'], colors: ['Negro', 'Blanco', 'Azul'], popular: false },
	{ id: 13, name: 'Mochila Deportiva', brand: 'Adidas', price: 65.00, category: 'accesorios', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop', rating: 4.8, sizes: ['Única'], colors: ['Negro', 'Azul'], popular: true },
	{ id: 14, name: 'Botella de Agua', brand: 'Under Armour', price: 18.00, category: 'accesorios', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop', rating: 4.6, sizes: ['500ml', '750ml'], colors: ['Negro', 'Azul', 'Rosa'], popular: false },
	{ id: 15, name: 'Guantes Gym', brand: 'Puma', price: 25.00, category: 'accesorios', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop', rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['Negro'], popular: true },
  
	// Implementos
	{ id: 16, name: 'Balón Fútbol', brand: 'Nike', price: 45.00, category: 'implementos', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop', rating: 4.9, sizes: ['5'], colors: ['Blanco/Negro'], popular: true },
	{ id: 17, name: 'Mancuernas Set', brand: 'Under Armour', price: 85.00, category: 'implementos', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop', rating: 4.8, sizes: ['5kg', '10kg'], colors: ['Negro'], popular: true },
	{ id: 18, name: 'Colchoneta Yoga', brand: 'Adidas', price: 35.00, category: 'implementos', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop', rating: 4.6, sizes: ['Única'], colors: ['Morado', 'Rosa', 'Azul'], popular: false },
	{ id: 19, name: 'Banda Elástica', brand: 'Puma', price: 15.00, category: 'implementos', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop', rating: 4.4, sizes: ['Ligera', 'Media', 'Fuerte'], colors: ['Verde', 'Rojo', 'Azul'], popular: false }
];

// Estado global
let currentCategory = 'all';
let currentProducts = [...products];
let cartItems = 0;
let selectedSizes = [];
let gridColumns = 3;

// Renderizar productos
function renderProducts(productsToRender = currentProducts) {
	const grid = document.getElementById('productsGrid');
	grid.innerHTML = '';
  
	// Actualizar clases del grid según columnas
	const gridClasses = {
		2: 'grid-cols-1 sm:grid-cols-2',
		3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
	};
	grid.className = `grid ${gridClasses[gridColumns]} gap-6`;
  
	productsToRender.forEach((product, index) => {
		const productCard = document.createElement('div');
		productCard.className = 'glass-card rounded-3xl card-hover p-6 border border-white/10 group fade-in';
		productCard.style.animationDelay = `${index * 0.1}s`;
    
		const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
		productCard.innerHTML = `
			<div class="relative mb-6 overflow-hidden rounded-xl">
				<img src="${product.image}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" alt="${product.name}">
				${product.popular ? '<div class="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">⚡ Popular</div>' : ''}
				${discount > 0 ? `<div class="absolute top-3 right-3 gradient-bg text-white px-3 py-1 rounded-full text-xs font-bold">-${discount}%</div>` : ''}
				<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			</div>
      
			<div class="space-y-3">
				<div>
					<h4 class="font-bold text-white text-lg group-hover:text-red-400 transition-colors">${product.name}</h4>
					<p class="text-gray-400 text-sm">${product.brand}</p>
				</div>
        
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-2">
						<span class="text-xl font-bold text-red-400">$${product.price.toFixed(2)}</span>
						${product.originalPrice ? `<span class="text-sm text-gray-500 line-through">$${product.originalPrice.toFixed(2)}</span>` : ''}
					</div>
					<div class="flex items-center space-x-1">
						<div class="flex">
							${Array.from({length: 5}, (_, i) => 
								`<i class="fas fa-star ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'} text-xs"></i>`
							).join('')}
						</div>
						<span class="text-sm text-gray-400 ml-1">${product.rating}</span>
					</div>
				</div>
        
				<div class="flex flex-wrap gap-1 mb-3">
					${product.sizes.slice(0, 4).map(size => 
						`<span class="text-xs px-2 py-1 glass-card rounded text-gray-400">${size}</span>`
					).join('')}
					${product.sizes.length > 4 ? '<span class="text-xs px-2 py-1 glass-card rounded text-gray-400">+</span>' : ''}
				</div>
        
				<button onclick="addToCart(${product.id})" class="w-full gradient-bg text-white py-3 rounded-xl hover:scale-105 transition-all duration-300 font-medium elegant-shadow">
					<i class="fas fa-cart-plus mr-2"></i>
					Agregar al carrito
				</button>
			</div>
		`;
    
		grid.appendChild(productCard);
	});
  
	// Actualizar contador
	document.getElementById('productCount').textContent = `Mostrando ${productsToRender.length} productos`;
}

// Filtrar por categoría
function filterByCategory(category) {
	currentCategory = category;
  
	// Actualizar botones de categoría
	document.querySelectorAll('.category-btn').forEach(btn => {
		btn.classList.remove('category-active');
		btn.classList.add('text-gray-300');
	});
	event.target.classList.add('category-active');
	event.target.classList.remove('text-gray-300');
  
	// Actualizar título
	const titles = {
		'all': 'Todos los productos',
		'mujer': 'Ropa Deportiva Mujer',
		'hombre': 'Ropa Deportiva Hombre',
		'niños': 'Ropa Deportiva Niños',
		'accesorios': 'Accesorios Deportivos',
		'implementos': 'Implementos Deportivos'
	};
	document.getElementById('categoryTitle').textContent = titles[category];
  
	filterProducts();
}

// Filtrar productos
function filterProducts() {
	let filtered = [...products];
  
	// Filtro por categoría
	if (currentCategory !== 'all') {
		filtered = filtered.filter(p => p.category === currentCategory);
	}
  
	// Filtro por búsqueda
	const searchTerm = document.getElementById('searchInput').value.toLowerCase();
	if (searchTerm) {
		filtered = filtered.filter(p => 
			p.name.toLowerCase().includes(searchTerm) || 
			p.brand.toLowerCase().includes(searchTerm)
		);
	}
  
	// Filtro por precio
	const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
	const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
	filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
  
	// Filtro por marcas
	const selectedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(cb => cb.value);
	if (selectedBrands.length > 0) {
		filtered = filtered.filter(p => selectedBrands.includes(p.brand));
	}
  
	// Filtro por tallas
	if (selectedSizes.length > 0) {
		filtered = filtered.filter(p => p.sizes.some(size => selectedSizes.includes(size)));
	}
  
	currentProducts = filtered;
	renderProducts();
}

// Ordenar productos
function sortProducts() {
	const sortBy = document.getElementById('sortSelect').value;
  
	switch(sortBy) {
		case 'name':
			currentProducts.sort((a, b) => a.name.localeCompare(b.name));
			break;
		case 'price-low':
			currentProducts.sort((a, b) => a.price - b.price);
			break;
		case 'price-high':
			currentProducts.sort((a, b) => b.price - a.price);
			break;
		case 'rating':
			currentProducts.sort((a, b) => b.rating - a.rating);
			break;
		case 'popular':
			currentProducts.sort((a, b) => b.popular - a.popular);
			break;
	}
  
	renderProducts();
}

// Establecer rango de precio
function setPriceRange(min, max) {
	document.getElementById('minPrice').value = min;
	document.getElementById('maxPrice').value = max === Infinity ? '' : max;
	filterProducts();
}

// Toggle talla
function toggleSize(size) {
	const index = selectedSizes.indexOf(size);
	if (index > -1) {
		selectedSizes.splice(index, 1);
		event.target.classList.remove('category-active');
		event.target.classList.add('text-gray-300');
	} else {
		selectedSizes.push(size);
		event.target.classList.add('category-active');
		event.target.classList.remove('text-gray-300');
	}
	filterProducts();
}

// Limpiar filtros
function clearFilters() {
	document.getElementById('searchInput').value = '';
	document.getElementById('minPrice').value = '';
	document.getElementById('maxPrice').value = '';
	document.querySelectorAll('.brand-filter').forEach(cb => cb.checked = false);
	selectedSizes = [];
  
	// Resetear botones de talla
	document.querySelectorAll('.size-btn').forEach(btn => {
		btn.classList.remove('category-active');
		btn.classList.add('text-gray-300');
	});
  
	filterProducts();
	showNotification('Filtros limpiados', 'Mostrando todos los productos', 'info');
}

// Cambiar vista de grid
function setGridView(columns) {
	gridColumns = columns;
	renderProducts();
}

// Toggle panel de filtros (móvil)
function toggleFilters() {
	const panel = document.getElementById('filtersPanel');
	panel.classList.toggle('hidden');
}

// Agregar al carrito
function addToCart(productId) {
	const product = products.find(p => p.id === productId);
	cartItems++;
	document.getElementById('cartCount').textContent = cartItems;
  
	// Animación del contador
	const cartCount = document.getElementById('cartCount');
	cartCount.classList.add('pulse-animation');
	setTimeout(() => cartCount.classList.remove('pulse-animation'), 1000);
  
	showNotification('¡Agregado!', `${product.name} añadido al carrito`, 'success');
}

// Funciones de navegación
function goBack() {
	showNotification('Regresando...', 'Volviendo a la página principal', 'info');
	setTimeout(() => window.history.back(), 1000);
}

function toggleCart() {
	showNotification('Carrito', 'Abriendo carrito de compras', 'info');
}

// Sistema de notificaciones
function showNotification(title, message, type = 'info') {
	const notification = document.getElementById('notification');
	const icon = document.getElementById('notificationIcon');
	const titleEl = document.getElementById('notificationTitle');
	const messageEl = document.getElementById('notificationMessage');
  
	const config = {
		success: { icon: 'fas fa-check', color: 'gradient-green', border: 'border-green-500/30' },
		error: { icon: 'fas fa-times', color: 'gradient-bg', border: 'border-red-500/30' },
		warning: { icon: 'fas fa-exclamation', color: 'bg-yellow-500', border: 'border-yellow-500/30' },
		info: { icon: 'fas fa-info', color: 'gradient-blue', border: 'border-blue-500/30' }
	};
  
	const typeConfig = config[type];
	icon.className = `w-10 h-10 ${typeConfig.color} rounded-full flex items-center justify-center`;
	icon.innerHTML = `<i class="${typeConfig.icon} text-white"></i>`;
	notification.className = `fixed top-24 right-6 glass-card text-white px-6 py-4 rounded-2xl shadow-2xl transform translate-x-full transition-all duration-500 z-50 border ${typeConfig.border} elegant-shadow`;
  
	titleEl.textContent = title;
	messageEl.textContent = message;
  
	notification.classList.remove('translate-x-full');
  
	setTimeout(() => {
		notification.classList.add('translate-x-full');
	}, 4000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
	renderProducts();
  
	// Mensaje de bienvenida
	setTimeout(() => {
		showNotification('¡Bienvenido al catálogo!', 'Explora nuestros 59 productos disponibles', 'info');
	}, 500);
});

(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'98db6cf400934958',t:'MTc2MDMyMjczNy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
