// Global variables
        let currentBalance = 5000;
        let cart = [];
        let pendingPayment = null;

        // Food items data
        const foodItems = [
            { id: 1, name: "Margherita Pizza", price: 299, emoji: "🍕" },
            { id: 2, name: "Chicken Burger", price: 199, emoji: "🍔" },
            { id: 3, name: "Veg Biryani", price: 249, emoji: "🍛" },
            { id: 4, name: "Pasta Alfredo", price: 179, emoji: "🍝" },
            { id: 5, name: "Chicken Wings", price: 229, emoji: "🍗" },
            { id: 6, name: "Ice Cream", price: 99, emoji: "🍦" },
            { id: 7, name: "French Fries", price: 89, emoji: "🍟" },
            { id: 8, name: "Chocolate Cake", price: 149, emoji: "🍰" },
            { id: 9, name: "Sushi Roll", price: 399, emoji: "🍣" },
            { id: 10, name: "Tacos", price: 159, emoji: "🌮" }
        ];

        // Initialize the app
        function initApp() {
            renderFoodItems();
            updateBalance();
        }

        // Render food items
        function renderFoodItems() {
            const foodGrid = document.getElementById('foodGrid');
            foodGrid.innerHTML = '';

            foodItems.forEach(item => {
                const foodItemDiv = document.createElement('div');
                foodItemDiv.className = 'food-item';
                foodItemDiv.innerHTML = `
                    <div class="food-emoji">${item.emoji}</div>
                    <div class="food-name">${item.name}</div>
                    <div class="food-price">₹${item.price}</div>
                    <button class="add-btn" onclick="addToCart(${item.id})">Add to Cart</button>
                `;
                foodGrid.appendChild(foodItemDiv);
            });
        }

        // Add item to cart
        function addToCart(itemId) {
            const item = foodItems.find(f => f.id === itemId);
            const existingItem = cart.find(c => c.id === itemId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }

            updateCart();
            showSuccessMessage("Item added to cart! 🎉");
        }

        // Update cart display
        function updateCart() {
            const cartSection = document.getElementById('cartSection');
            const cartItems = document.getElementById('cartItems');
            const cartCount = document.getElementById('cartCount');
            const cartTotal = document.getElementById('cartTotal');

            if (cart.length === 0) {
                cartSection.style.display = 'none';
                return;
            }

            cartSection.style.display = 'block';
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

            cartItems.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.innerHTML = `
                    <div>
                        <span>${item.emoji} ${item.name}</span>
                        <div style="font-size: 0.9rem; color: #666;">₹${item.price} x ${item.quantity}</div>
                    </div>
                    <div>
                        <button onclick="changeQuantity(${item.id}, -1)" style="background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; margin-right: 5px;">-</button>
                        <span style="margin: 0 10px; font-weight: bold;">${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)" style="background: #4ecdc4; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; margin-left: 5px;">+</button>
                        <div style="font-weight: bold; margin-top: 5px;">₹${itemTotal}</div>
                    </div>
                `;
                cartItems.appendChild(cartItemDiv);
            });

            cartTotal.textContent = `Total: ₹${total}`;
        }

        // Change item quantity
        function changeQuantity(itemId, change) {
            const item = cart.find(c => c.id === itemId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    cart = cart.filter(c => c.id !== itemId);
                }
                updateCart();
            }
        }

        // Proceed to payment
        function proceedToPayment() {
            if (cart.length === 0) {
                showErrorMessage("Your cart is empty!");
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            pendingPayment = { items: [...cart], total: total };

            // Show payment details in bank tab
            displayPaymentDetails();
            
            // Switch to bank tab
            switchTab('bank');
            
            // Set payment amount
            document.getElementById('payAmount').value = total;
            
            showSuccessMessage("Redirected to BankClown for payment! 🏦");
        }

        // Display payment details
        function displayPaymentDetails() {
            if (!pendingPayment) return;

            const paymentDetails = document.getElementById('paymentDetails');
            const paymentItems = document.getElementById('paymentItems');
            const paymentTotal = document.getElementById('paymentTotal');

            paymentDetails.style.display = 'block';
            paymentItems.innerHTML = '';

            pendingPayment.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'payment-item';
                itemDiv.innerHTML = `
                    <span>${item.emoji} ${item.name} x${item.quantity}</span>
                    <span>₹${item.price * item.quantity}</span>
                `;
                paymentItems.appendChild(itemDiv);
            });

            paymentTotal.textContent = `₹${pendingPayment.total}`;
        }

        // Switch tabs
        function switchTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(tab => tab.classList.remove('active'));

            // Remove active class from all buttons
            const tabButtons = document.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Show selected tab
            document.getElementById(tabName + '-tab').classList.add('active');
            
            // Add active class to clicked button
            event.target.classList.add('active');
        }

        // Add money to account
        function addMoney() {
            const amount = parseFloat(document.getElementById('addAmount').value);
            
            if (isNaN(amount) || amount <= 0) {
                showErrorMessage("Please enter a valid amount!");
                return;
            }

            currentBalance += amount;
            updateBalance();
            document.getElementById('addAmount').value = '';
            showSuccessMessage(`₹${amount} added successfully! 💰`);
        }

        // Make payment
        function makePayment() {
            const amount = parseFloat(document.getElementById('payAmount').value);
            
            if (isNaN(amount) || amount <= 0) {
                showErrorMessage("Please enter a valid amount!");
                return;
            }

            if (amount > currentBalance) {
                showErrorMessage("Insufficient balance! 😕");
                return;
            }

            currentBalance -= amount;
            updateBalance();
            document.getElementById('payAmount').value = '';

            // If this is a pending food order payment
            if (pendingPayment && amount === pendingPayment.total) {
                cart = []; // Clear cart
                updateCart();
                pendingPayment = null;
                document.getElementById('paymentDetails').style.display = 'none';
                showSuccessMessage(`Food order payment of ₹${amount} completed successfully! 🍕✅`);
            } else {
                showSuccessMessage(`Payment of ₹${amount} completed successfully! 💳✅`);
            }
        }

        // Update balance display
        function updateBalance() {
            document.getElementById('currentBalance').textContent = `₹${currentBalance.toLocaleString()}`;
        }

        // Show success message
        function showSuccessMessage(message) {
            const successDiv = document.getElementById('successMessage');
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 3000);
        }

        // Show error message
        function showErrorMessage(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }

        // Initialize app when page loads
        window.onload = initApp;
