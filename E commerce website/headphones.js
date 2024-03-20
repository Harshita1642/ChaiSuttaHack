document.addEventListener("DOMContentLoaded", function() {
    const listProductHTML = document.querySelector('.listProduct');
    const listCartHTML = document.querySelector('.listCart');
    const iconCart = document.querySelector('.icon-cart');
    const iconCartSpan = document.querySelector('.icon-cart > span');
    const body = document.querySelector('body');
    const closeCart = document.querySelector('.close');
    const searchInput = document.getElementById("searchInput");
    let products = [];
    let cart = [];

    // Function to toggle cart visibility
    function toggleCart() {
        body.classList.toggle('showCart');
    }

    // Event listeners for cart toggle
    const navbarCartButton = document.querySelector(".fa-cart-shopping");
    navbarCartButton.addEventListener("click", toggleCart);
    iconCart.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);

    // Function to render products
    function renderProducts(productsArray) {
        listProductHTML.innerHTML = '';
        productsArray.forEach(product => {
            const newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <div class="details">
                    <h2 class="title">${product.name}</h2>
                    <i class="fa-solid fa-fire"></i>
                </div>
                <div class="price">Price $${product.price}</div>
                <button class="addCart">Add To Cart</button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }

    // Function to filter products based on search term
    function filterProducts(searchTerm) {
        const filteredProducts = products.filter(product => {
            const productName = product.name.toLowerCase();
            return productName.includes(searchTerm);
        });

        renderProducts(filteredProducts);
    }

    // Event listener for search input
    searchInput.addEventListener('input', function(event) {
        const searchTerm = event.target.value.toLowerCase();
        filterProducts(searchTerm);
    });

    // Add event listener for adding products to cart
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('addCart')) {
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    });

    // Add product to cart
    function addToCart(product_id) {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
        if (cart.length <= 0) {
            cart = [{
                product_id: product_id,
                quantity: 1
            }];
        } else if (positionThisProductInCart < 0) {
            cart.push({
                product_id: product_id,
                quantity: 1
            });
        } else {
            cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
        }
        addCartToMemory();
        addCartToHTML();
    }

    // Add cart items to local storage
    function addCartToMemory() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Render cart items
    function addCartToHTML() {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        if (cart.length > 0) {
            cart.forEach(item => {
                totalQuantity = totalQuantity + item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;

                let positionProduct = products.findIndex((value) => value.id == item.product_id);
                if (positionProduct === -1) return;
                let info = products[positionProduct];
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                    <div class="image">
                        <img src="${info.image}">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="totalPrice">$${info.price * item.quantity}</div>
                    <div class="quantity">
                        <span class="minus">-</span>
                        <span>${item.quantity}</span>
                        <span class="plus">+</span>
                    </div>
                `;
            })
        }
        iconCartSpan.innerText = totalQuantity;
    }

    // Event listener for changing quantity in cart
    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = 'minus';
            if (positionClick.classList.contains('plus')) {
                type = 'plus';
            }
            changeQuantityCart(product_id, type);
        }
    });

    // Function to change quantity in cart
    function changeQuantityCart(product_id, type) {
        let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);

        if (positionItemInCart >= 0) {
            let info = cart[positionItemInCart];
            switch (type) {
                case 'plus':
                    cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                    break;

                default:
                    let changeQuantity = cart[positionItemInCart].quantity - 1;
                    if (changeQuantity > 0) {
                        cart[positionItemInCart].quantity = changeQuantity;
                    } else {
                        cart.splice(positionItemInCart, 1);
                    }
                    break;
            }
        }
        addCartToHTML();
        addCartToMemory();
    }

    // Function to initialize the app
    function initApp() {
        fetch('products2.json')
            .then(response => response.json())
            .then(data => {
                products = data;
                renderProducts(products);

                if (localStorage.getItem('cart')) {
                    cart = JSON.parse(localStorage.getItem('cart'));
                    addCartToHTML();
                }
            });
    }

    // Call the initialize function
    initApp();
});
