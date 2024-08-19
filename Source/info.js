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

// For Showing One Card
const selectedPost = JSON.parse(localStorage.getItem('selectedPost'));

if (selectedPost) {
    // Display the post details on the page
    document.getElementById('postTitle').textContent = selectedPost.productTitle;
    document.getElementById('postDescription').textContent = selectedPost.productDescription;
    document.getElementById('postPrice').textContent = `Rs ${selectedPost.productPrice}`;
    document.getElementById('postImage').src = selectedPost.productImage;
    document.getElementById('personName').textContent = selectedPost.personName;
    document.getElementById('personNumber').textContent = selectedPost.personNumber;
}

// Add To Cart Functionality
const addToCartButton = document.querySelector(".addToCart");
const cartNumberElement = document.querySelector(".indicator-item");

// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

addToCartButton.addEventListener("click", () => {
    const selectedPost = JSON.parse(localStorage.getItem('selectedPost'));
    if (selectedPost) {
        // Check if the item is already in the cart
        const existingItemIndex = cart.findIndex(item => item.id === selectedPost.id);

        if (existingItemIndex !== -1) {
            // Item exists in the cart, increase its quantity
            cart[existingItemIndex].quantity = Number(cart[existingItemIndex].quantity || 1) + 1;
        } else {
            // Item does not exist in the cart, add it with quantity 1
            selectedPost.quantity = 1;
            cart.push(selectedPost);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartNumber();
    }
});

function updateCartNumber() {
    cartNumberElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

updateCartNumber(); // Initial update

// For Changing Page To View Cart
const viewCartButton = document.querySelector(".viewCart"); // Button on the navbar

viewCartButton.addEventListener("click", () => {
    window.location.href = "cart.html";
});


