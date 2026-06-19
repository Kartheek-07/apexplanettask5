/* ========================================
   SMART STORE - JAVASCRIPT FUNCTIONALITY
   Cart Management & Interactive Features
   ======================================== */

// ========== CART MANAGEMENT OBJECT ==========
const CartManager = {
    // Initialize cart from localStorage
    cart: JSON.parse(localStorage.getItem('smartStoreCart')) || [],

    // Add item to cart
    addItem(productName, price) {
        const existingItem = this.cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                name: productName,
                price: price,
                quantity: 1,
                id: Date.now()
            });
        }

        this.saveCart();
        this.displayNotification(`${productName} added to cart!`);
    },

    // Remove item from cart
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
    },

    // Update item quantity
    updateQuantity(itemId, quantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
            }
            this.saveCart();
        }
    },

    // Clear entire cart
    clearCart() {
        if (this.cart.length === 0) {
            alert('Your cart is already empty!');
            return;
        }

        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
        }
    },

    // Get total price
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Get total items count
    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    },

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('smartStoreCart', JSON.stringify(this.cart));
        this.updateCartDisplay();
        this.updateCartCount();
    },

    // Display notification
    displayNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-in-out;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        `;

        document.body.appendChild(notification);

        // Add animation styles
        if (!document.querySelector('style[data-notification]')) {
            const style = document.createElement('style');
            style.setAttribute('data-notification', 'true');
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// ========== GLOBAL FUNCTIONS ==========

/**
 * Add product to cart
 * @param {string} productName - Name of the product
 * @param {number} price - Price of the product
 */
function addToCart(productName, price) {
    CartManager.addItem(productName, price);
}

/**
 * Remove item from cart
 * @param {number} itemId - ID of the item to remove
 */
function removeFromCart(itemId) {
    CartManager.removeItem(itemId);
}

/**
 * Update item quantity
 * @param {number} itemId - ID of the item
 * @param {number} quantity - New quantity
 */
function updateItemQuantity(itemId, quantity) {
    CartManager.updateQuantity(itemId, quantity);
}

/**
 * Clear the entire cart
 */
function clearCart() {
    CartManager.clearCart();
}

/**
 * Proceed to checkout
 */
function checkout() {
    const total = CartManager.getTotal();
    const itemCount = CartManager.cart.length;

    if (CartManager.cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout!');
        return;
    }

    const orderSummary = `
Order Summary
=============
Items: ${itemCount}
Total: ₹${total.toLocaleString('en-IN')}

Thank you for shopping at Smart Store!
    `.trim();

    alert(orderSummary);
    console.log('Order placed:', {
        items: CartManager.cart,
        total: total,
        timestamp: new Date().toISOString()
    });

    // Clear cart after successful order
    CartManager.cart = [];
    CartManager.saveCart();
}

/**
 * Update cart display on the page
 */
function updateCartDisplay() {
    const cartList = document.getElementById('cart');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItems = document.getElementById('cartItems');

    cartList.innerHTML = '';

    if (CartManager.cart.length === 0) {
        cartItems.style.display = 'none';
        cartEmpty.style.display = 'block';
    } else {
        cartItems.style.display = 'block';
        cartEmpty.style.display = 'none';

        CartManager.cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'cart-item';
            listItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div style="font-weight: 600; color: #28a745; min-width: 100px; text-align: right;">
                    ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartList.appendChild(listItem);
        });

        // Update total price
        const total = CartManager.getTotal();
        document.getElementById('cartTotal').textContent = total.toLocaleString('en-IN');
    }
}

/**
 * Update cart count in header
 */
function updateCartCount() {
    const cartCount = CartManager.getCartCount();
    document.getElementById('cartCount').textContent = cartCount;
}

/**
 * Toggle cart visibility
 */
function toggleCart() {
    const cartSection = document.getElementById('cartSection');
    cartSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Format Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

/**
 * Initialize page on load
 */
function initializePage() {
    console.log('🛍️ Smart Store initialized');
    updateCartDisplay();
    updateCartCount();

    // Add event listener to cart toggle button
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', toggleCart);
    }

    // Log cart data to console for debugging
    console.log('Current cart:', CartManager.cart);
}

/**
 * Handle before unload to save cart
 */
window.addEventListener('beforeunload', () => {
    CartManager.saveCart();
});

/**
 * Performance monitoring
 */
window.addEventListener('load', () => {
    if (window.performance && performance.timing) {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});

/**
 * Error handling
 */
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
});

// ========== INITIALIZE ON DOM READY ==========
document.addEventListener('DOMContentLoaded', initializePage);

// ========== SERVICE WORKER REGISTRATION (PWA Support) ==========
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
        console.log('Service Worker not available (this is optional)');
    });
}

// ========== LOCAL STORAGE SYNC ==========
window.addEventListener('storage', (event) => {
    if (event.key === 'smartStoreCart') {
        CartManager.cart = JSON.parse(event.newValue) || [];
        updateCartDisplay();
        updateCartCount();
    }
});

// ========== ACCESSIBILITY ENHANCEMENTS ==========
document.addEventListener('keydown', (event) => {
    // Press 'C' to toggle cart (accessibility shortcut)
    if (event.ctrlKey && event.key === 'c') {
        event.preventDefault();
        toggleCart();
    }
});

console.log('✅ Smart Store JavaScript loaded successfully');
console.log('Tip: Use Ctrl+C to toggle cart (accessibility shortcut)');
