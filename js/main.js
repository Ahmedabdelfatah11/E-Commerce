
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
        if(category=="mobile")
        {
            section.innerHTML = `   
                <section id="hotDeal">
            <div class=" w-100">
      <div class="d-flex justify-content-center align-items-center pt-5">
      <div class="hotDealNums d-flex justify-content-center align-items-center">
        <div class="d-block text-center text-light">
        <h4 class="p-0 m-0">02</h4>
        <p class="p-0 m-0">Days</p>
      </div>
      </div>
      <div class="hotDealNums d-flex mx-2 justify-content-center align-items-center">
        <div class="d-block text-center text-light">
        <h4 class="p-0 m-0">10</h4>
        <p class="p-0 m-0">hours</p>
      </div>
      </div>
      <div class="hotDealNums d-flex justify-content-center align-items-center">
        <div class="d-block text-center text-light">
        <h4 class="p-0 m-0">34</h4>
        <p class="p-0 m-0">Mins</p>
      </div>
      </div>
      <div class="hotDealNums ms-2 d-flex justify-content-center align-items-center">
        <div class="d-block text-center text-light">
        <h4 class="p-0 m-0">60</h4>
        <p class="p-0 m-0">secs</p>
      </div>
      </div>
    </div>
    <div class="hotDealBody text-center">
      <h3 class="">hot deal this week</h3>
      <p>New Collection Up to 50% OFF</p>
      <button class="btn btn-danger">Shop Now</button>
    </div>
    </div>
        </section>

                <div style="display-flex">
                    <h2 class = "h2 categoryh2 text-center" style="font-size: 25px;font-weight: 600;">${category}</h2>
                    <a class = "align-baseline mx-4" href = "#"><strong class = "align-baseline">see more</strong></a>
                </div>
                <div class="row p-4 g-2">
                    ${products.slice(1,5).map(product => `
                        <div class="col-12 col-md-6 col-md-4 col-lg-3 align-items-stretch">
                            <div class="card position position-relative">
                            <i class="fa-solid fs-2 fa-basket-shopping "></i>
                             <div class="layer d-flex justify-content-end p-5 w-100">
                     <img src="${product.image}" class="card-img-top" alt="Product">
                             </div>
                                <div class="card-body">
                                    <h6 class="card-title text-truncate" style=" overflow: hidden;">${product.title.split(" ").slice(0, 2).join(" ")}</h5>
                                    <p class="card-text">price: ${product.price} $</p>
                                    <div class="card-footer">
                                    <button onclick="redirectToProductDetails(${product.id})" class="btn btn-primary">View Details</button>
                                </div>
                                </div>
                            </div>
                        </div> 
                    `).join('')}
                </div>  
            `;
        }
        else{
            section.innerHTML = `   
               <div style="display-flex">
                    <h2 class = "h2 categoryh2 text-center" style="font-size: 25px;font-weight: 600;">${category}</h2>
                    <a class = "align-baseline mx-4" href = "#"><strong class = "align-baseline">see more</strong></a>
                </div>
                <div class="row p-4 g-2">
                    ${products.slice(0,4).map(product => `
                        <div class="col-12 col-md-6 col-md-4 col-lg-3 align-items-stretch">
                            <div class="card position position-relative">
                            <i class="fa-solid fs-2 fa-basket-shopping "></i>
                             <div class="layer d-flex justify-content-end p-5 w-100">
                     <img src="${product.image}" class="card-img-top" alt="Product">
                             </div>
                                <div class="card-body">
                                    <h6 class="card-title text-truncate" style=" overflow: hidden;">${product.title.split(" ").slice(0, 2).join(" ")}</h5>
                                    <p class="card-text">price: ${product.price} $</p>
                                    <div class="card-footer">
                                    <button onclick="redirectToProductDetails(${product.id})" class="btn btn-primary">View Details</button>
                                </div>
                                </div>
                            </div>
                        </div> 
                    `).join('')}
                </div>  
            `;

        }
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

// Search Feature //
function search(query) {
    if (query !== "") {
      const categoryResult = searchByCategoryName(query);
      const titleResult = searchByTitle(query);
      const descriptionResult = searchByDescription(query);
      const merged = categoryResult.concat(categoryResult, titleResult, descriptionResult);
      const map = new Map();
      merged.forEach(function (product) {
        map.set(product.id, product);
      });
      currentDisplayed =  Array.from(map.values());
      displayProducts("Result")
      document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
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

  document.querySelector("#searchButton").addEventListener("click", ()=>{
    var query = document.querySelector("#searchInput").value;
    window.location.href = `pages/Category.html?search=${query}`;
    // search(query);
  })

  document.querySelector("#searchInput").addEventListener("blur", ()=>{
    var query = document.querySelector("#searchInput").value;
    window.location.href = `pages/Category.html?search=${query}`;
    // search(query);
  })
  
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
function redirectToProductDetails(productId){ 
    window.location.href = `pages/show_details.html?id=${productId}`;  
    console.log(productId);
}  

var button = document.querySelectorAll('.Categories');
for (var i = 0; i < button.length; i++) {
    button[i].onclick = function() {
        var category = this.getAttribute('data-category');
        window.location.href = `pages/Category.html?type=${category}`;
    };
}

