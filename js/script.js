let cardItems = [];
let form = document.getElementById('productForm');
let productNameInput = document.getElementById('productName');
let productPriceInput = document.getElementById('productPrice');
let productQuantityInput = document.getElementById('productQuantity');
let productImgInput = document.getElementById('productImg');

let buttonAdd = document.getElementById('buttonAdd');
let buttonUpdate = document.getElementById('buttonUpdate');

if (localStorage.getItem('cardItems')) {
    cardItems = JSON.parse(localStorage.getItem('cardItems'));
    displayProducts();
}

function calculateTotals() {
    let subtotal = 0;
    for (let item of cardItems) {
        subtotal += item.price * item.quantity;
    }
    document.getElementById('subtotal').textContent = `${subtotal}`;
    document.getElementById('total').textContent = `${subtotal}`;  
}

function addProduct() {
    if (productImgInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let carditem = {
                name: productNameInput.value,
                price: productPriceInput.value,
                quantity: parseInt(productQuantityInput.value),
                img: e.target.result
            };
            cardItems.push(carditem);
            localStorage.setItem('cardItems', JSON.stringify(cardItems));
            displayProducts();
            clearForm();
        };
        reader.readAsDataURL(productImgInput.files[0]);
    } else {
        alert('Please select an image.');
    }
}

buttonAdd.addEventListener('click', function (e) {
    e.preventDefault();
    addProduct();
});

function displayProducts() {
    let data = '';
    for (let i = 0; i < cardItems.length; i++) {
        const subTotal = cardItems[i].price * cardItems[i].quantity;
        data += `
            <tr>
                <td><img src="${cardItems[i].img}" width="60"></td>
                <td>${cardItems[i].name}</td>
                <td>${cardItems[i].price} $</td>
                <td>${cardItems[i].quantity}</td>
                
                <td>${subTotal} $</td>
                <td><button class="btn btn-primary btn-sm" onclick="updateProduct(${i})">Update</button></td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteProduct(${i})">Delete</button></td>
            </tr>
        `;
    }
    document.getElementById('cartBody').innerHTML = data;
    calculateTotals();
}

function clearForm() {
    productNameInput.value = '';
    productPriceInput.value = '';
    productQuantityInput.value = '';
    productImgInput.value = '';
}

function deleteProduct(index) {
    cardItems.splice(index, 1);
    localStorage.setItem('cardItems', JSON.stringify(cardItems));
    displayProducts();
}

function updateProduct(index) {
    const item = cardItems[index];
    productNameInput.value = item.name;
    productPriceInput.value = item.price;
    productQuantityInput.value = item.quantity;

    buttonAdd.classList.add('d-none');
    buttonUpdate.classList.remove('d-none');
    buttonUpdate.setAttribute('data-index', index);
} 
function updateProductData(index) {
    if (productImgInput.files.length > 0) {
        let reader = new FileReader();
        reader.onload = function (e) {
            cardItems[index] = {
                name: productNameInput.value,
                price: productPriceInput.value,
                quantity:productQuantityInput.value,
                img: e.target.result
            };
            saveAndRefresh();
        };
        reader.readAsDataURL(productImgInput.files[0]);
    } else { 
        cardItems[index].name = productNameInput.value;
        cardItems[index].price =productPriceInput.value;
        cardItems[index].quantity =productQuantityInput.value;
        saveAndRefresh();
    }
} 
function saveAndRefresh() {
    localStorage.setItem('cardItems', JSON.stringify(cardItems));
    displayProducts();
    clearForm();
    buttonAdd.classList.remove('d-none');
    buttonUpdate.classList.add('d-none');
}


buttonUpdate.addEventListener('click', function (e) {
    e.preventDefault();
    const index = this.getAttribute('data-index');
    updateProductData(index);
});


