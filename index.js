import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDocs, collection, where, query } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { auth, db } from "./Source/fbconfig.js";

const userAvatar = document.querySelector("#userAvatar");
const userImage = document.querySelector("#userImage");

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
        userAvatar.innerHTML = `<button class="btn hover:bg-black hover:text-white border-none text-[18px] w-[100px]"><a href="./Source/login.html"> Login </a></button>`
    }
});
// For User Logout

const logout = document.querySelector("#logout-btn");

logout.addEventListener("click", (event) => {
    event.preventDefault();
    signOut(auth).then(() => {
        window.open("./Source/login.html", "_self");
    }).catch((error) => {
        alert(error);
    });
})

// Function For Getting Data


let allPosts = []; // Array to hold all posts

async function fetchData() {
    try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        allPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPosts(allPosts);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
}

// Function For Rendering The Data
function renderPosts(posts) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    // Display each post
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('border', 'rounded-lg', 'shadow-lg', 'overflow-hidden');

        postElement.innerHTML = `
            <img src="${post.productImage}" alt="${post.productTitle}" class="w-full h-72 object-cover" />
            <div class="p-4">
                <h3 class="text-lg font-semibold">${post.productTitle}</h3>
                <p class="text-gray-600 text-sm">${post.productDescription}</p>
                <div class="mt-4 flex justify-between items-center">
                    <span class="text-base font-bold">Rs ${post.productPrice}</span>
                    <button class="btn btn-primary btn-sm" data-id="${post.id}">More Info</button>
                </div>
            </div>
        `;

        // Add event listener for "More Info" button
        const moreInfoButton = postElement.querySelector('button');
        moreInfoButton.addEventListener('click', () => {
            localStorage.setItem('selectedPost', JSON.stringify(post));
            // Optionally redirect to a detail page or show a modal
            window.location.href = './Source/info.html'; // Replace with your detail page URL
        });

        productsGrid.appendChild(postElement);
    });
}

// Funtion For Search
function filterPosts(searchItem) {
    if (searchItem === '') {
        renderPosts(allPosts); // Show all posts if search is empty
    } else {
        // Filter posts based on search query
        const filteredPosts = allPosts.filter(post =>
            post.productTitle.toLowerCase().includes(searchItem.toLowerCase())
        );
        renderPosts(filteredPosts);
    }
}

// Add event listener for search input
let searchBar = document.getElementById('searchInput');
searchBar.addEventListener('input', (event) => {
    const searchItem = event.target.value;
    filterPosts(searchItem);
});

// For Data
fetchData();