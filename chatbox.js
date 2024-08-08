document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart from local storage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Define products with their codes for easy reference
  const products = {
      'MT001': { name: "Men's T-Shirt", price: 20 },
      'MS001': { name: "Men's Shorts", price: 25 },
      'WT001': { name: "Women's T-Shirt", price: 20 },
      'WS001': { name: "Women's Shorts", price: 25 },
      'KT001': { name: "Kid's T-Shirt", price: 20 },
      'KS001': { name: "Kid's Shorts", price: 25 }
  };

  // Update cart display on page load
  updateCartCount();

  // Chatbox HTML
  const chatboxHTML = `
      <div id="chatbox" style="position:fixed;bottom:10px;right:10px;width:300px;height:400px;border:1px solid #ccc;background:#fff;box-shadow:0px 0px 10px rgba(0,0,0,0.5);display:none;">
          <div id="chatbox-header" style="background:#007BFF;color:white;padding:10px;cursor:pointer;">
              Chat with us
              <span id="chatbox-close" style="float:right;cursor:pointer;">&times;</span>
          </div>
          <div id="chatbox-messages" style="height:calc(100% - 80px);overflow-y:scroll;padding:10px;"></div>
          <input id="chatbox-input" style="width:100%;padding:10px;border:none;" placeholder="Type your message..."/>
      </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatboxHTML);

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

      const normalizedInput = input.toLowerCase();

      if (normalizedInput.includes('hello') || normalizedInput.includes('hi')) {
          addMessage('Assistant: Hello! How can I help you today?');
      } else if (/add\s(\d+)\s(\w+)/.test(normalizedInput)) {
          const match = normalizedInput.match(/add\s(\d+)\s(\w+)/);
          const quantity = parseInt(match[1]);
          const code = match[2].toUpperCase();
          addToCartByCode(code, quantity);
      } else if (/remove\s(\d+)\s(\w+)/.test(normalizedInput)) {
          const match = normalizedInput.match(/remove\s(\d+)\s(\w+)/);
          const quantity = parseInt(match[1]);
          const code = match[2].toUpperCase();
          removeFromCartByCode(code, quantity);
      } else {
          addMessage('Assistant: Sorry, I did not understand that. Use "add [quantity] [code]" or "remove [quantity] [code]".');
      }
  }

  function addMessage(text) {
      const message = document.createElement('div');
      message.textContent = text;
      chatboxMessages.appendChild(message);
      chatboxMessages.scrollTop = chatboxMessages.scrollHeight; // Scroll to bottom
  }

  function addToCartByCode(code, quantity) {
      const product = products[code];
      if (product) {
          for (let i = 0; i < quantity; i++) {
              cart.push(product);
          }
          localStorage.setItem('cart', JSON.stringify(cart));
          addMessage(`Assistant: Added ${quantity} of code ${code} to your cart.`);
          updateCartCount();
      } else {
          addMessage('Assistant: Code not found.');
      }
  }

  function removeFromCartByCode(code, quantity) {
      const product = products[code];
      if (product) {
          for (let i = 0; i < quantity; i++) {
              const index = cart.findIndex(cartItem => cartItem.name === product.name && cartItem.price === product.price);
              if (index !== -1) {
                  cart.splice(index, 1);
              } else {
                  break;
              }
          }
          localStorage.setItem('cart', JSON.stringify(cart));
          addMessage(`Assistant: Removed ${quantity} of code ${code} from your cart.`);
          updateCartCount();
      } else {
          addMessage('Assistant: Code not found.');
      }
  }

  function updateCartCount() {
      const cartCount = cart.length;
      document.getElementById('cart-count').innerText = cartCount;
  }
});
