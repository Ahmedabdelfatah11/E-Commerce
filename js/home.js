console.log("hello")

viewProducts();

async function viewProducts(){
    let products = await getProducts();
    console.log(products);
    let groupedProducts = groupProducts(products);
    console.log(groupedProducts);   

    let productsSections = document.querySelector("#products");

    for (let [category, products] of groupedProducts){
        let section = document.createElement("section");
        section.classList.add("container-fluid", "p-3");
        section.id = category; 

        section.innerHTML = `
            <h2>${category}</h2>
            <div class="row p-4">
                ${products.slice(0,4).map(product => `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 align-items-stretch">
                        <div class="card h-100">
                            <img src="${product.image}" class="card-img-top" alt="Product">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">${product.price}</p>
                                <button onclick="redirectToProductDetails(${product.id})" class="btn btn-primary">View Details</button>
                            </div>
                        </div>
                    </div> 
                `).join('')}
            </div>  
        `;  

        productsSections.appendChild(section); 
    }
}

let details = document.getElementById("details"); 
function groupProducts(products){
    let map = new Map();
    products.forEach(product => {
        let category = product.category;
        if (!map.has(category)){
            map.set(category,[]);
        }
        map.get(category).push(product);
    });
    return map
}

async function getProducts(){
    let response = await fetch('https://fakestoreapi.in/api/products')
    let data = await response.json();
    return data.products;
} 
function redirectToProductDetails(productId){
    window.location.href = `pages/showDetails.html?id=${productId}`;

}   