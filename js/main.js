viewProducts();
var products;
var currentDisplayed;
var groupedProducts;
var productsSections = document.querySelector("#products");
// displayProductsOfCategory("audio");

async function viewProducts(){
    products = await getProducts();
    groupedProducts = groupProducts(products);   
    
    for (let [category, products] of groupedProducts){
        let section = document.createElement("section");
        section.classList.add("container-fluid", "p-3");
        section.id = category;
        console.log(category);
        section.innerHTML = `   
            <div style="display-flex">
                <h2 class = "h2">${category}</h2>
                <a class = "align-baseline mx-4" href = "#"><strong class = "align-baseline">see more</strong></a>
            </div>
            <div class="row p-4">
                ${products.slice(0,4).map(product => `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 align-items-stretch">
                        <div class="card h-100">
                            <img src="${product.image}" class="card-img-top" alt="Product">
                            <div class="card-body">
                                <h6 class="card-title text-truncate" style="max-height: 2rem; overflow: hidden;">${product.title}</h5>
                                <p class="card-text">price: ${product.price} $</p>
                                <button onclick="redirectToProductDetails(${product.id})" class="btn btn-primary">View Details</button>
                            </div>
                        </div>
                    </div> 
                `).join('')}
            </div>  
        `;
        section.querySelector("a").addEventListener(
            "click", 
            () => displayCategoryProducts(category)

        )          
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
    window.location.href = `/pages/show_details.html?id=${productId}`;

}   

function displayCategoryProducts(category){
    console.log(category);
    
    currentDisplayed = groupedProducts.get(category);
    productsSections.innerHTML = "";
    var section = document.createElement("section");
    section.classList.add("container-fluid", "p-3"); 
    section.innerHTML = `
        <a href = "#"> ${category}</a>
        <div class="row p-4">
            ${currentDisplayed.map(product => `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 align-items-stretch">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="Product">
                        <div class="card-body">
                            <h6 class="card-title text-truncate" style="max-height: 2rem; overflow: hidden;">${product.title}</h5>
                            <p class="card-text">price: ${product.price} $</p>
                            <button onclick="redirectToProductDetails(${product.id})" class="btn btn-primary">View Details</button>
                        </div>
                    </div>
                </div> 
            `).join('')}
        </div>  
    `;  
    productsSections.appendChild(section);
}

function search(query) {
    if (query !== "") {
      const categoryResult = searchByCategoryName(query);
      const titleResult = searchByTitle(query);
      const descriptionResult = searchByDescription(query);
      const merged = cityResult.concat(categoryResult, titleResult, descriptionResult);
      const map = new Map();
      merged.forEach(function (product) {
        map.set(product.id, product);
      });
      return Array.from(map.values());
    } else {
      return currentDisplayed; 
    }
  }

  function searchByCategoryName(query) {
    return products.filter(function(product) {
      return product.category.toLowerCase().includes(query.toLowerCase());
    });
  }
  
  function searchByTitle(query) {
    return products.filter(function(product) {
        return product.title.toLowerCase().includes(query.toLowerCase());
      });
  }
  function searchByDescription(query) {
    return products.filter(function(product) {
        return product.description.toLowerCase().includes(query.toLowerCase());
      });
  }