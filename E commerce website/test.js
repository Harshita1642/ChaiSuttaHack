document.addEventListener('DOMContentLoaded', () => {
    const iconCart = document.querySelector('.cart');
    const body = document.querySelector('body');
    const closeCart = document.querySelector('.close');

    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        body.classList.remove('showCart');
    });

    // Get all the "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.buy');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.parentElement;
            const productName = product.querySelector('.name h1').textContent;
            const productPrice = product.querySelector('.cost h1').textContent;

            // Create a new item for the cart
            const newItem = document.createElement('div');
            newItem.classList.add('cart-item');
            newItem.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${productName}</span>
                    <span class="cart-item-price">${productPrice}</span>
                </div>
                <button class="remove-item">Remove</button>
            `;

            // Append the new item to the cart
            const cartItems = document.querySelector('.cart-items');
            cartItems.appendChild(newItem);

            // Update the total price
            updateTotal();
        });
    });

    // Function to update the total price in the cart
    function updateTotal() {
        const cartItems = document.querySelectorAll('.cart-item');
        let totalPrice = 0;

        cartItems.forEach(item => {
            const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('$', ''));
            totalPrice += price;
        });

        const totalElement = document.querySelector('.total-price');
        totalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    // Remove item from cart
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const itemToRemove = event.target.parentElement;
            itemToRemove.remove();
            updateTotal();
        }
    });
});
