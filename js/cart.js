let form = document.getElementById('productForm');
let productNameInput = document.getElementById('productName');
let productPriceInput = document.getElementById('productPrice');
let productQuantityInput = document.getElementById('productQuantity');
let productImgInput = document.getElementById('productImg');
let buttonAdd = document.getElementById('buttonAdd');
let buttonUpdate = document.getElementById('buttonUpdate');

let apiProducts = [];


let cartItems = [];


async function fetchProducts() {
    try {
        let response = await fetch('https://fakestoreapi.in/api/products');
        let data = await response.json();
        apiProducts = data.products;
        console.log("Products loaded from API:", apiProducts.length);
        
        
        loadCartItems();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}


function loadCartItems() {
    if (localStorage.getItem('cartItems')) {
        cartItems = JSON.parse(localStorage.getItem('cartItems'));
        
        
        cartItems = cartItems.map(cartItem => {
            
            const apiProduct = apiProducts.find(p => p.id == cartItem.id);
            
            if (apiProduct) {
                
                return {
                    ...apiProduct,
                    quantity: cartItem.quantity
                };
            }
            
            
            return cartItem;
        });
        
        displayProducts();
    }
}

function calculateTotals() {
    let subtotal = 0;
    for (let item of cartItems) {
        subtotal += parseFloat(item.price) * parseInt(item.quantity);
    }
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
}


function addProduct() {
    
    if (productNameInput.value && productPriceInput.value && productQuantityInput.value) {
        let productId = null;
        
        
        const matchingProduct = apiProducts.find(p => 
            p.title.toLowerCase() === productNameInput.value.toLowerCase());
        
        if (matchingProduct) {
            productId = matchingProduct.id;
        } else {
            
            productId = 'manual-' + Date.now();
        }
        
        let cartItem = {
            id: productId,
            title: productNameInput.value,
            price: parseFloat(productPriceInput.value),
            quantity: parseInt(productQuantityInput.value)
        };
        
        
        if (productImgInput.files.length > 0) {
            let reader = new FileReader();
            reader.onload = function (e) {
                cartItem.image = e.target.result;
                
                
                addToCart(cartItem);
                saveAndRefresh();
            };
            reader.readAsDataURL(productImgInput.files[0]);
        } else if (matchingProduct) {
            
            cartItem.image = matchingProduct.image;
            addToCart(cartItem);
            saveAndRefresh();
        } else {
            
            alert('Please select an image or choose a product from the API.');
        }
    } else {
        alert('Please fill all product details.');
    }
}


function addToCart(item) {
    
    let existingIndex = cartItems.findIndex(cartItem => cartItem.id == item.id);
    
    if (existingIndex >= 0) {
        
        cartItems[existingIndex].quantity += item.quantity || 1;
    } else {
        
        cartItems.push(item);
    }
}


if (buttonAdd) {
    buttonAdd.addEventListener('click', function (e) {
        e.preventDefault();
        addProduct();
    });
}


function displayProducts() {
    let data = '';
    for (let i = 0; i < cartItems.length; i++) {
        const subTotal = parseFloat(cartItems[i].price) * parseInt(cartItems[i].quantity);
        data += `
            <tr>
                <td><img src="${cartItems[i].image}" width="60" alt="${cartItems[i].title}"></td>
                <td>${cartItems[i].title.split(" ").slice(0, 2).join(" ")}</td>
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


function clearForm() {
    if (productNameInput) productNameInput.value = '';
    if (productPriceInput) productPriceInput.value = '';
    if (productQuantityInput) productQuantityInput.value = '';
    if (productImgInput) productImgInput.value = '';
}


function deleteProduct(index) {
    cartItems.splice(index, 1);
    saveAndRefresh();
}


function updateProduct(index) {
    const item = cartItems[index];
    
    if (productNameInput) productNameInput.value = item.title;
    if (productPriceInput) productPriceInput.value = item.price;
    if (productQuantityInput) productQuantityInput.value = item.quantity;

    buttonAdd.classList.add('d-none');
    buttonUpdate.classList.remove('d-none');
    buttonUpdate.setAttribute('data-index', index);
}


function updateProductData(index) {
    
    const productId = cartItems[index].id;
    const apiProduct = apiProducts.find(p => p.id == productId);
    
    if (productImgInput && productImgInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function (e) {
            if (apiProduct) {
                
                cartItems[index] = {
                    ...apiProduct,
                    title: productNameInput.value,
                    price: parseFloat(productPriceInput.value),
                    quantity: parseInt(productQuantityInput.value),
                    image: e.target.result
                };
            } else {
                
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
            
            cartItems[index] = {
                ...apiProduct,
                title: productNameInput ? productNameInput.value : cartItems[index].title,
                price: productPriceInput ? parseFloat(productPriceInput.value) : cartItems[index].price,
                quantity: productQuantityInput ? parseInt(productQuantityInput.value) : cartItems[index].quantity
            };
        } else {
            
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
var button = document.querySelectorAll('.Categories');
for (var i = 0; i < button.length; i++) {
    button[i].onclick = function() {
        var category = this.getAttribute('data-category');
        window.location.href = `../pages/Category.html?type=${category}`;
    };
}
var checkoutBtn=document.querySelector('.checkout-btn');

checkoutBtn.addEventListener('click',function(){
    window.location.href = '../pages/CheckOut.html'; 
})