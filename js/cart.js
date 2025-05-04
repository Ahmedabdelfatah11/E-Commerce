let form = document.getElementById('productForm');
let productNameInput = document.getElementById('productName');
let productPriceInput = document.getElementById('productPrice');
let productQuantityInput = document.getElementById('productQuantity');
let productImgInput = document.getElementById('productImg');
let buttonAdd = document.getElementById('buttonAdd');
let buttonUpdate = document.getElementById('buttonUpdate');

// Products from API
let apiProducts = [];

// Cart items
let cartItems = [];

// Fetch products from API
async function fetchProducts() {
    try {
        let response = await fetch('https://fakestoreapi.in/api/products');
        let data = await response.json();
        apiProducts = data.products;
        console.log("Products loaded from API:", apiProducts.length);
        
        // Load cart items after API data is available
        loadCartItems();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Load cart items from localStorage
function loadCartItems() {
    if (localStorage.getItem('cartItems')) {
        cartItems = JSON.parse(localStorage.getItem('cartItems'));
        
        // Enrich cart items with complete API data if needed
        cartItems = cartItems.map(cartItem => {
            // Find the full product data from API
            const apiProduct = apiProducts.find(p => p.id == cartItem.id);
            
            if (apiProduct) {
                // Return merged object with API data and cart quantity
                return {
                    ...apiProduct,
                    quantity: cartItem.quantity
                };
            }
            
            // If not found in API (could be manually added), return as is
            return cartItem;
        });
        
        displayProducts();
    }
}

// Calculate subtotal and total
function calculateTotals() {
    let subtotal = 0;
    for (let item of cartItems) {
        subtotal += parseFloat(item.price) * parseInt(item.quantity);
    }
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
}

// Add a new product to cart (from form)
function addProduct() {
    // Check if we're adding a product from the form
    if (productNameInput.value && productPriceInput.value && productQuantityInput.value) {
        let productId = null;
        
        // Try to find product in API by name
        const matchingProduct = apiProducts.find(p => 
            p.title.toLowerCase() === productNameInput.value.toLowerCase());
        
        if (matchingProduct) {
            productId = matchingProduct.id;
        } else {
            // Generate a unique ID for manually added products
            productId = 'manual-' + Date.now();
        }
        
        let cartItem = {
            id: productId,
            title: productNameInput.value,
            price: parseFloat(productPriceInput.value),
            quantity: parseInt(productQuantityInput.value)
        };
        
        // Add image if provided
        if (productImgInput.files.length > 0) {
            let reader = new FileReader();
            reader.onload = function (e) {
                cartItem.image = e.target.result;
                
                // Add to cart and save
                addToCart(cartItem);
                saveAndRefresh();
            };
            reader.readAsDataURL(productImgInput.files[0]);
        } else if (matchingProduct) {
            // Use image from API
            cartItem.image = matchingProduct.image;
            addToCart(cartItem);
            saveAndRefresh();
        } else {
            // No image available
            alert('Please select an image or choose a product from the API.');
        }
    } else {
        alert('Please fill all product details.');
    }
}

// Add item to cart and handle duplicates
function addToCart(item) {
    // Check if product already exists in cart
    let existingIndex = cartItems.findIndex(cartItem => cartItem.id == item.id);
    
    if (existingIndex >= 0) {
        // Update quantity if product already in cart
        cartItems[existingIndex].quantity += item.quantity || 1;
    } else {
        // Add new product to cart
        cartItems.push(item);
    }
}

// Event listener for Add button
if (buttonAdd) {
    buttonAdd.addEventListener('click', function (e) {
        e.preventDefault();
        addProduct();
    });
}

// Display all products in the cart
function displayProducts() {
    let data = '';
    for (let i = 0; i < cartItems.length; i++) {
        const subTotal = parseFloat(cartItems[i].price) * parseInt(cartItems[i].quantity);
        data += `
            <tr>
                <td><img src="${cartItems[i].image}" width="60" alt="${cartItems[i].title}"></td>
                <td>${cartItems[i].title}</td>
                <td>${cartItems[i].price} $</td>
                <td>${cartItems[i].quantity}</td>
                <td>${subTotal.toFixed(2)} $</td>
                <td><button class="btn btn-primary btn-sm" onclick="updateProduct(${i})">Update</button></td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteProduct(${i})">Delete</button></td>
            </tr>
        `;
    }
    document.getElementById('cartBody').innerHTML = data;
    calculateTotals();
}

// Clear the form inputs
function clearForm() {
    if (productNameInput) productNameInput.value = '';
    if (productPriceInput) productPriceInput.value = '';
    if (productQuantityInput) productQuantityInput.value = '';
    if (productImgInput) productImgInput.value = '';
}

// Delete a product from cart
function deleteProduct(index) {
    cartItems.splice(index, 1);
    saveAndRefresh();
}

// Prepare form for updating a product
function updateProduct(index) {
    const item = cartItems[index];
    
    if (productNameInput) productNameInput.value = item.title;
    if (productPriceInput) productPriceInput.value = item.price;
    if (productQuantityInput) productQuantityInput.value = item.quantity;

    buttonAdd.classList.add('d-none');
    buttonUpdate.classList.remove('d-none');
    buttonUpdate.setAttribute('data-index', index);
}

// Update a product in the cart
function updateProductData(index) {
    // Keep the product ID and API data
    const productId = cartItems[index].id;
    const apiProduct = apiProducts.find(p => p.id == productId);
    
    if (productImgInput && productImgInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function (e) {
            if (apiProduct) {
                // Keep API data but update quantity and possibly other fields
                cartItems[index] = {
                    ...apiProduct,
                    title: productNameInput.value,
                    price: parseFloat(productPriceInput.value),
                    quantity: parseInt(productQuantityInput.value),
                    image: e.target.result
                };
            } else {
                // Update manually added product
                cartItems[index].title = productNameInput.value;
                cartItems[index].price = parseFloat(productPriceInput.value);
                cartItems[index].quantity = parseInt(productQuantityInput.value);
                cartItems[index].image = e.target.result;
            }
            saveAndRefresh();
        };
        reader.readAsDataURL(productImgInput.files[0]);
    } else {
        if (apiProduct) {
            // Keep API data but update editable fields
            cartItems[index] = {
                ...apiProduct,
                title: productNameInput ? productNameInput.value : cartItems[index].title,
                price: productPriceInput ? parseFloat(productPriceInput.value) : cartItems[index].price,
                quantity: productQuantityInput ? parseInt(productQuantityInput.value) : cartItems[index].quantity
            };
        } else {
            // Update manually added product
            if (productNameInput) cartItems[index].title = productNameInput.value;
            if (productPriceInput) cartItems[index].price = parseFloat(productPriceInput.value);
            if (productQuantityInput) cartItems[index].quantity = parseInt(productQuantityInput.value);
        }
        saveAndRefresh();
    }
}
 
function saveAndRefresh() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayProducts();
    clearForm();
    
    if (buttonAdd && buttonUpdate) {
        buttonAdd.classList.remove('d-none');
        buttonUpdate.classList.add('d-none');
    }
}
 
if (buttonUpdate) {
    buttonUpdate.addEventListener('click', function (e) {
        e.preventDefault();
        const index = this.getAttribute('data-index');
        updateProductData(index);
    });
}
 
document.addEventListener('DOMContentLoaded', function() { 
    fetchProducts();
});