console.log("hello")

viewProducts();

//to do to print all products of specific category
function viewAllCategoryProducts(products){

}
async function viewProducts(){
    let products = await getProducts();
    console.log(products);
    let groupedProducts = groupProducts(products);
    console.log(groupProducts(products));
    let productsSections = document.querySelector("#products");
    for (let [category, products] of groupedProducts){
        let section = document.createElement("section");
        section.classList.add("container-fluid", "p-3");
        section.id = category;
        section.innerHTML = `
                <h2>${category}</h2>
                <div class="row p-4">
                    <!-- Example Product -->
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 align-items-stretch">
                        <div class="card h-100">
                            <img src="${products[1].image}" class="card-img-top" alt="Product">
                            <div class="card-body">
                                <h5 class="card-title">${products[1].title}</h5>
                                <p class="card-text">${products[1].price}</p>
                                <a href="#" class="btn btn-primary">Buy Now</a>
                            </div>
                        </div> 
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 align-items-stretch">
                        <div class="card h-100">
                            <img src="${products[2].image}" class="card-img-top" alt="Product">
                            <div class="card-body">
                                <h5 class="card-title">${products[2].title}</h5>
                                <p class="card-text">${products[2].price}</p>
                                <a href="#" class="btn btn-primary">Buy Now</a>
                            </div>
                        </div> 
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 align-items-stretch">
                        <div class="card h-100">
                            <img src="${products[3].image}" class="card-img-top" alt="Product">
                            <div class="card-body">
                                <h5 class="card-title">${products[3].title}</h5>
                                <p class="card-text">${products[3].price}</p>
                                <a href="#" class="btn btn-primary">Buy Now</a>
                            </div>
                        </div> 
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 align-items-stretch">
                        <div class="card h-100">
                            <img src="${products[4].image}" class="card-img-top" alt="Product">
                            <div class="card-body">
                                <h5 class="card-title">${products[4].title}</h5>
                                <p class="card-text">${products[4].price}</p>
                                <a href="#" class="btn btn-primary">Buy Now</a>
                            </div>
                        </div> 
                    </div>                    
                </div>`
            ;
            productsSections.appendChild(section);
        console.log(category, products);
    }
}

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
  