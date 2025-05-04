 
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const count = cartItems.reduce((total, item) => total + parseInt(item.quantity || 1), 0);
    const cartCountElement = document.getElementById('cartCount');
    
    if (cartCountElement) {
        cartCountElement.textContent = count;
        
        // Hide badge if cart is empty
        if (count === 0) {
            cartCountElement.classList.add('d-none');
        } else {
            cartCountElement.classList.remove('d-none');
        }
    }
}

// Update cart count when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Update cart count every few seconds in case it changes in another tab
    setInterval(updateCartCount, 2000);
}); 