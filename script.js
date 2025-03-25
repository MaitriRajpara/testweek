const PRODUCTS_KEY = 'products';

// Get products from localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    displayProducts();
}

// Generate a unique Product ID
function generateProductId() {
    return crypto.randomUUID();
}

// Navigate to Add Product Page
function navtoAddProduct() {
    window.location.href = 'add_product.html';
}

// Save or Update a Product
function saveNewProduct() {
    let productId = document.getElementById('productId').value || generateProductId();
    let productName = document.getElementById('productName').value;
    let productPrice = document.getElementById('productPrice').value;
    let productDescription = document.getElementById('productDescription').value;
    let imageInput = document.getElementById('imageInput').files[0];

    if (productName && productPrice && productDescription) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let newProduct = {
                ProductId: productId,
                ProductName: productName,
                Price: Number(productPrice),
                Description: productDescription,
                Image: e.target.result || document.getElementById('existingImage').src
            };

            let products = getProducts();
            let existingIndex = products.findIndex(p => p.ProductId === productId);

            if (existingIndex !== -1) {
                products[existingIndex] = newProduct;
            } else {
                products.push(newProduct);
                alert('Product Added Successfully');
            }

            saveProducts(products);
            alert('Done Successfully');
            window.location.href = 'index.html';
        };

        if (imageInput) {
            reader.readAsDataURL(imageInput);
        } else {
            reader.onload();
        }
    } else {
        alert('Please fill all fields and select an image');
    }
}

// Display Products
function displayProducts() {
    let products = getProducts();
    let productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-sm-6 mb-3';
        div.innerHTML = `
            <div class="card">
                <img src="${product.Image}" class="card-img-top" alt="${product.ProductName}" style="height: 200px; object-fit: cover;">
                <div class="card-body text-center">
                    <h5 class="card-title">${product.ProductName}</h5>
                    <p class="card-text">Price: ${product.Price}</p>
                    <p class="card-text">${product.Description}</p>
                    <button class="btn btn-warning" onclick="editProduct('${product.ProductId}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.ProductId}')">Delete</button>
                </div>
            </div>
        `;
        productList.appendChild(div);
    });
}

// Edit Product
function editProduct(productId) {
    console.log("Editing product with ID:", productId); // Debugging
    localStorage.setItem('editProductId', productId);
    console.log("Stored editProductId:", localStorage.getItem('editProductId')); // Check if stored
    window.location.href = 'add_product.html';
}


// Populate Fields in Add Product Page when Editing
function fillFields() {
    let productId = localStorage.getItem('editProductId');
    if (productId) {
        let products = getProducts();
        let product = products.find(p => p.ProductId === productId);
        if (product) {
            document.getElementById('productId').value = product.ProductId;
            document.getElementById('productName').value = product.ProductName;
            document.getElementById('productPrice').value = product.Price;
            document.getElementById('productDescription').value = product.Description;
            document.getElementById('existingImage').src = product.Image;
            document.getElementById('saveButton').innerText = "Save Changes";
        }
        localStorage.removeItem('editProductId');
    }
    // editProduct();
}

// Delete Product
function deleteProduct(productId) {
    let confirmDelete = confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
        let products = getProducts().filter(p => p.ProductId !== productId);
        saveProducts(products);
        alert('Product Deleted Successfully');
    }
}

// Filter & Sort Products
function filterAndDisplay() {
    let query = document.getElementById('filterInput').value.toLowerCase();
    let sortCriteria = document.getElementById('sortSelect').value;
    let products = getProducts();

    // Filter products based on Name or Description
    let filteredProducts = products.filter(product =>
        product.ProductName.toLowerCase().includes(query) ||
        product.Description.toLowerCase().includes(query)
    );

    // Sorting logic
    filteredProducts.sort((a, b) => {
        if (sortCriteria === 'Price') {
            return a.Price - b.Price;
        } else if (sortCriteria === 'ProductName') {
            return a.ProductName.localeCompare(b.ProductName);
        }
        return 0;
    });

    // Display filtered and sorted products
    let productList = document.getElementById('productList');
    productList.innerHTML = '';

    let row = document.createElement('div');
    row.className = 'row';

    filteredProducts.forEach(product => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-sm-6 mb-3';
        div.innerHTML = `
            <div class="card">
                <img src="${product.Image}" class="card-img-top" alt="${product.ProductName}" style="height: 200px; object-fit: cover;">
                <div class="card-body text-center">
                    <h5 class="card-title">${product.ProductName}</h5>
                    <p class="card-text">Price: ${product.Price}</p>
                    <p class="card-text">${product.Description}</p>
                    <button class="btn btn-warning" onclick="editProduct('${product.ProductId}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.ProductId}')">Delete</button>
                </div>
            </div>
        `;
        row.appendChild(div);
    });

    productList.appendChild(row);
}
