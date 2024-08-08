document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update cart display on page load
    updateCartCount();

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.parentElement;
            const name = product.getAttribute('data-name');
            const price = parseFloat(product.getAttribute('data-price'));

            const cartItem = { name, price };
            cart.push(cartItem);

            // Save cart to local storage
            localStorage.setItem('cart', JSON.stringify(cart));

            updateCartCount();
            alert(`${name} added to cart!`);
        });
    });

    function updateCartCount() {
        const cartCount = cart.length;
        document.getElementById('cart-count').innerText = cartCount;

        // Update cart items in cart.html if this is the cart page
        if (document.getElementById('cart-items')) {
            const cartItemsContainer = document.getElementById('cart-items');
            cartItemsContainer.innerHTML = '';
            let total = 0;

            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
                
                // Add a remove button to each item
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', () => removeItemFromCart(index));
                li.appendChild(removeButton);

                cartItemsContainer.appendChild(li);
                total += item.price;
            });

            document.getElementById('total-price').innerText = total.toFixed(2);
        }
    }

    function removeItemFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Checkout button functionality
    if (document.getElementById('checkout')) {
        document.getElementById('checkout').addEventListener('click', () => {
            alert('Thank you for your purchase!');
            cart = []; // Clear cart after checkout

            // Remove cart from local storage
            localStorage.removeItem('cart');

            updateCartCount();
        });
    }

    // Chatbox functionality
    const chatbox = document.getElementById('chatbox');
    const chatboxInput = document.getElementById('chatbox-input');
    const chatboxMessages = document.getElementById('chatbox-messages');
    const chatboxClose = document.getElementById('chatbox-close');

    // Show chatbox
    chatbox.style.display = 'block';

    // Handle chatbox close button
    chatboxClose.addEventListener('click', () => {
        chatbox.style.display = 'none';
    });

    // Handle chatbox input
    chatboxInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const userInput = this.value;
            this.value = '';
            handleUserInput(userInput);
        }
    });

    function handleUserInput(input) {
        addMessage(`You: ${input}`);

        if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
            addMessage('Assistant: Hello! How can I help you today?');
        } else if (input.toLowerCase().includes('add item') && /from\s(\w+)\spage/i.test(input)) {
            const page = input.match(/from\s(\w+)\spage/i)[1];
            addToCartFromPage(page);
        } else if (input.toLowerCase().includes('remove item') && /from\s(\w+)\spage/i.test(input)) {
            const page = input.match(/from\s(\w+)\spage/i)[1];
            removeItemFromCartByPage(page);
        } else {
            addMessage('Assistant: Sorry, I did not understand that.');
        }
    }

    function addMessage(text) {
        const message = document.createElement('div');
        message.textContent = text;
        chatboxMessages.appendChild(message);
        chatboxMessages.scrollTop = chatboxMessages.scrollHeight; // Scroll to bottom
    }

    function addToCartFromPage(page) {
        const items = {
            'men': [
                { name: "Men's T-Shirt", price: 20 },
                { name: "Men's Shorts", price: 25 }
            ],
            'women': [
                { name: "Women's T-Shirt", price: 20 },
                { name: "Women's Shorts", price: 25 }
            ],
            'kids': [
                { name: "Kid's T-Shirt", price: 20 },
                { name: "Kid's Shorts", price: 25 }
            ]
        };

        const products = items[page.toLowerCase()];
        if (products) {
            products.forEach(product => {
                cart.push(product);
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            addMessage(`Assistant: Added items from the ${page} collection to your cart.`);
            updateCartCount();
        } else {
            addMessage('Assistant: Page not found.');
        }
    }

    function removeItemFromCartByPage(page) {
        const items = {
            'men': [
                { name: "Men's T-Shirt", price: 20 },
                { name: "Men's Shorts", price: 25 }
            ],
            'women': [
                { name: "Women's T-Shirt", price: 20 },
                { name: "Women's Shorts", price: 25 }
            ],
            'kids': [
                { name: "Kid's T-Shirt", price: 20 },
                { name: "Kid's Shorts", price: 25 }
            ]
        };

        const products = items[page.toLowerCase()];
        if (products) {
            products.forEach(product => {
                // Find and remove the item from the cart
                const index = cart.findIndex(cartItem => cartItem.name === product.name && cartItem.price === product.price);
                if (index !== -1) {
                    cart.splice(index, 1);
                }
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            addMessage(`Assistant: Removed items from the ${page} collection from your cart.`);
            updateCartCount();
        } else {
            addMessage('Assistant: Page not found.');
        }
    }
});
