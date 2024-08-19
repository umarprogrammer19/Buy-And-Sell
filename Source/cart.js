import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDocs, collection, where, query } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { auth, db } from "./fbconfig.js";

const userImage = document.querySelector("#userImage");

// For Checking User Logged In Or Not
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const uid = user.uid;
            console.log(uid);

            const q = query(collection(db, "users"), where("uid", "==", uid));
            const querySnapshot = await getDocs(q);

            let userData = null;
            querySnapshot.forEach(doc => {
                userData = doc.data();
                userImage.src = userData.profileImage;
            });

        } catch (error) {
            console.log(error);
        };
    } else {
        my_modal_2.showModal();
    }
});

// For User Logout
const logout = document.querySelector("#logout-btn");

logout.addEventListener("click", (event) => {
    event.preventDefault();
    signOut(auth).then(() => {
        window.open("login.html", "_self");
    }).catch((error) => {
        alert(error);
    });
})

// Fetch cart data from local storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render cart items
function renderCartItems() {
    const cartContainer = document.querySelector('.cart-items-container');
    cartContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemPrice = Number(item.productPrice); // Ensure productPrice is a number
        const itemQuantity = Number(item.quantity) || 1; // Ensure quantity is a number, default to 1
        const itemTotal = itemPrice * itemQuantity; // Calculate total price for the item

        subtotal += itemTotal; // Add to subtotal

        const cartItemHTML = `
            
<div class="cart-item bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6"
    data-index="${index}">
    <div class="col-span-12 md:col-span-2">
        <img src="${item.productImage}" alt="${item.productTitle}" class="w-full h-auto rounded-lg">
    </div>
    <div class="col-span-12 md:col-span-10">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4">
            <h5 class="text-xl sm:text-2xl font-bold text-gray-900">${item.productTitle}</h5>
            <button
                class="remove-item bg-red-50 text-red-500 rounded-full p-2 mt-2 sm:mt-0 focus:outline-none hover:bg-red-100 transition-colors"
                data-index="${index}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="currentColor" />
                    <path d="M8 12H16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </div>
        <p class="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">${item.productDescription}</p>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div class="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-0">
                <button
                    class="decrease-quantity bg-gray-100 border border-gray-300 rounded-full p-2 focus:outline-none hover:bg-gray-200 transition-colors"
                    data-index="${index}">
                    <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </button>
                <input type="text"
                    class="quantity-input border border-gray-300 rounded-full w-10 sm:w-12 text-center text-gray-900 font-semibold py-1 px-3 bg-gray-200"
                    value="${itemQuantity}" data-index="${index}" readonly>
                <button
                    class="increase-quantity bg-gray-100 border border-gray-300 rounded-full p-2 focus:outline-none hover:bg-gray-200 transition-colors"
                    data-index="${index}">
                    <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8h4M8 6v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </button>
            </div>
            <h6 class="item-total text-lg sm:text-xl font-bold text-gray-900">Rs ${itemTotal.toFixed(2)}</h6>
        </div>
    </div>
</div>

        `;

        cartContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });

    // Update the subtotal
    document.querySelector('.subtotal-amount').textContent = `Rs ${subtotal.toFixed(2)}`;
}

// Function to update cart data in local storage
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartNumber();
}

// Event listeners for quantity changes and item removal
document.addEventListener('click', (event) => {
    const target = event.target.closest('button');

    if (target) {
        const index = target.dataset.index;

        if (target.classList.contains('increase-quantity')) {
            cart[index].quantity++;
        }

        if (target.classList.contains('decrease-quantity')) {
            cart[index].quantity--;
            if (cart[index].quantity < 1) {
                cart.splice(index, 1); // Remove item from cart if quantity < 1
            }
        }

        if (target.classList.contains('remove-item')) {
            cart.splice(index, 1); // Remove item from cart
        }

        updateCart();
    }
});

// Update cart number in the cart icon
function updateCartNumber() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector(".indicator-item").textContent = totalItems;
}

// Initialize cart rendering
renderCartItems();

// Add Event Listener for Checkout Button and Show Modal
const checkoutButton = document.querySelector(".bg-indigo-600");
const checkoutModal = document.getElementById("checkoutModal");
const closeModalButton = document.getElementById("closeModal");

checkoutButton.addEventListener("click", () => {
    populateCheckoutModal();
    checkoutModal.classList.remove("hidden");
});

closeModalButton.addEventListener("click", () => {
    checkoutModal.classList.add("hidden");
});

//
function populateCheckoutModal() {
    const checkoutItemsContainer = document.getElementById("checkoutItems");
    const checkoutTotalElement = document.getElementById("checkoutTotal");

    checkoutItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = Number(item.productPrice) * item.quantity;
        total += itemTotal;

        const itemHTML = `
            <div class="flex justify-between items-center mb-2">
                <span>${item.productTitle} (x${item.quantity})</span>
                <span>Rs ${itemTotal.toFixed(2)}</span>
            </div>
        `;
        checkoutItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    checkoutTotalElement.textContent = `Rs ${total.toFixed(2)}`;
}

