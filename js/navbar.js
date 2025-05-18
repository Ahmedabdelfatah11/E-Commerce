function attachNavbarEvents(){
    const searchButton = document.querySelector("#searchButton");
    const searchInput = document.querySelector("#searchInput");
  
    if (searchButton && searchInput) {
        searchButton.addEventListener("click", (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
            window.location.href = `/pages/Category.html?search=${encodeURIComponent(query)}`;
            }
        });
    
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
            e.preventDefault();
            searchButton.click();
            }
        });

        document.querySelectorAll('.Categories').forEach(button => {
            button.onclick = function () {
                const category = this.getAttribute('data-category');
                window.location.href = `/pages/home.html?type=${category}`;
            };
        });
        
    }

  
}
    