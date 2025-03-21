document.addEventListener("DOMContentLoaded", function () {
    let urlParams = new URLSearchParams(window.location.search);
    let action = urlParams.get("action");
    let productId = urlParams.get("id");

    if (action === "add") {
        openProduct();  // Open the form for adding a product
    } else if (action === "edit" && productId) {
        openProduct(productId);  // Open the form for editing the product
    } else {
        loadProducts();  // Load the product list if no specific action
    }
});

function openProduct(id = null) {
    document.getElementById("productForm").reset();
    document.getElementById("productImagePreview").style.display = "none";
    let titleHeader = document.getElementById("productTitleHeader");
    let formAction = document.getElementById("productForm");

    if (id) {
        titleHeader.textContent = "Edit Product";
        let products = getProducts();
        let product = products.find(p => p.id == id);
        if (product) {
            document.getElementById("productId").value = product.id;
            document.getElementById("productName").value = product.name;
            document.getElementById("productPrice").value = product.price;
            document.getElementById("productDesc").value = product.desc;
            document.getElementById("productImagePreview").src = product.image;
            document.getElementById("productImagePreview").style.display = "block";
        }
    } else {
        titleHeader.textContent = "Add Product";
    }

    document.getElementById("productDialog").classList.add("active");
}

document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let id = document.getElementById("productId").value || Date.now();
    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let desc = document.getElementById("productDesc").value;
    let imageElement = document.getElementById("productImagePreview");

    if (!name || !price || imageElement.src == "") {
        alert("Name, Price, and Image are required!");
        return;
    }

    let products = getProducts();
    let productIndex = products.findIndex(p => p.id == id);
    let image = imageElement.src;

    if (productIndex > -1) {
        products[productIndex] = { id, name, image, price, desc };
    } else {
        products.push({ id, name, image, price, desc });
    }

    saveProducts(products);
    window.location.href = "product.html";  // Redirect to the main product list after saving
    loadProducts();
    closeProductDialog();
});

function loadProducts() {
    const products = getProducts();
    let productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach(product => {
        let productCard = document.createElement("div");
        productCard.classList.add("col-md-4", "mb-3");

        productCard.innerHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h5 class="mt-2">${product.name}</h5>
                <p>${product.desc}</p>
                <h6>Price : $${product.price}</h6>
                <div class="product-actions">
                    <button class="btn btn-warning btn-sm w-50" onclick="openProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger btn-sm w-50" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
        `;

        productList.appendChild(productCard);
    });
}

function deleteProduct(id) {
    if (confirm("Are you sure?")) {
        let products = getProducts().filter(p => p.id != id);
        saveProducts(products);
        loadProducts();
    }
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
}

function closeProductDialog() {
    document.getElementById("productDialog").classList.remove("active");
}
