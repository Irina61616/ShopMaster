
const products = [
    {
        id: 1,
        name: "Смартфон X",
        price: 29990,
        category: "Электроника",
        inStock: true
    },
    {
        id: 2,
        name: "Ноутбук Pro",
        price: 54990,
        category: "Электроника",
        inStock: true
    },
    {
        id: 3,
        name: "Наушники",
        price: 4990,
        category: "Аксессуары",
        inStock: true
    },
    {
        id: 4,
        name: "Клавиатура",
        price: 2990,
        category: "Аксессуары",
        inStock: false
    },
    {
        id: 5,
        name: "Мышь",
        price: 1990,
        category: "Аксессуары",
        inStock: true
    },
    {
        id: 6,
        name: "Монитор 24\"",
        price: 15990,
        category: "Электроника",
        inStock: true
    }
];


const CART_STORAGE_KEY = 'shopCart';

function getCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

 
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}


function addToCart(productId) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification('Товар добавлен в корзину');
}


function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    renderCartPage(); 
}


function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        renderCartPage(); 
    }
}


function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartCount();
    renderCartPage(); 
}


function getFullCartInfo() {
    const cart = getCart();
    return cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
            ...item,
            ...product,
            totalPrice: product.price * item.quantity
        };
    });
}


function getCartTotal() {
    const fullCart = getFullCartInfo();
    return fullCart.reduce((sum, item) => sum + item.totalPrice, 0);
}


function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}


function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
  
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    const cart = getCart();
    
    container.innerHTML = products.map(product => {
        const inCart = cart.some(item => item.id === product.id);
        
        return `
            <div class="product-card">
                <h3>${product.name}</h3>
                <div class="price">${product.price.toLocaleString()} ₽</div>
                <div class="category">${product.category}</div>
                <button 
                    onclick="addToCart(${product.id})"
                    ${!product.inStock ? 'disabled' : ''}
                >
                    ${product.inStock 
                        ? (inCart ? 'Добавить еще' : 'В корзину') 
                        : 'Нет в наличии'}
                </button>
            </div>
        `;
    }).join('');
}


function renderCartPage() {
    const cartContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('cart-total-price');
    
    if (!cartContainer) return;
    
    const fullCart = getFullCartInfo();
    
    if (fullCart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>Корзина пуста</p>
                <a href="index.html">Перейти к товарам</a>
            </div>
        `;
        if (totalPriceEl) totalPriceEl.textContent = '0';
        return;
    }
    
    cartContainer.innerHTML = fullCart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div>${item.price.toLocaleString()} ₽ за шт.</div>
            </div>
            <div class="cart-item-controls">
                <input 
                    type="number" 
                    min="1" 
                    value="${item.quantity}"
                    onchange="updateQuantity(${item.id}, parseInt(this.value))"
                >
                <button onclick="removeFromCart(${item.id})">Удалить</button>
            </div>
            <div class="cart-item-price">
                ${item.totalPrice.toLocaleString()} ₽
            </div>
        </div>
    `).join('');
    
    if (totalPriceEl) {
        totalPriceEl.textContent = getCartTotal().toLocaleString();
    }
}


window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    renderProducts();
    
    renderCartPage();
});


document.addEventListener('DOMContentLoaded', function() {
    const clearButton = document.getElementById('clear-cart');
    
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            clearCart();
        });
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);