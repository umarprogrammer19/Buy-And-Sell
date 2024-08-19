import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDocs, collection, where, query, addDoc, } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { auth, db, storage } from "./fbconfig.js";

const userImage = document.querySelector("#userImage");

let userUID = null;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const uid = user.uid;
            userUID = uid;
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
        window.open("login.html", "_self")
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

// Getting data From User For Uploading Ad
let productImage = document.querySelector("#fileInput");
let productTitle = document.querySelector("#product-title");
let productDescription = document.querySelector("#product-description");
let productPrice = document.querySelector("#product-price");
let personName = document.querySelector("#person-name");
let personNumber = document.querySelector("#person-number");
let postNowButton = document.querySelector("#post-now-button");

postNowButton.addEventListener("click", async (event) => {
    event.preventDefault();

    if (productImage.files[0] && productTitle.value && productDescription.value && productPrice.value && personName.value && personNumber.value
    ) {
        // Disable the button and show the loader
        postNowButton.disabled = true;
        postNowButton.innerHTML = '<span class="loading loading-bars loading-md"></span> Posting....';

        // For Getting User Image Url From Firebase Storage
        let file = productImage.files[0];
        let url = null;
        if (file) {
            url = await showImageURL(file, `${userUID}|||${(Math.random() * 100 * Date.now()).toFixed()}`);
            console.log("File Url:", url);
        }

        // For Add Data In Database
        try {
            const docRef = await addDoc(collection(db, "posts"), {
                productTitle: productTitle.value,
                productDescription: productDescription.value,
                productPrice: productPrice.value,
                personName: personName.value,
                personNumber: personNumber.value,
                productImage: url,
            });
            console.log("Document written with ID: ", docRef.id);
            productTitle.value = "";
            productDescription.value = "";
            productPrice.value = "";
            personName.value = "";
            personNumber.value = "";
            my_modal_2.showModal();
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            // Re-enable the button and reset the text
            postNowButton.disabled = false;
            postNowButton.innerHTML = 'Post Ad';
            // Show success modal and change page from registration to login
            my_modal_2.showModal();
        }
    } else {
        my_modal_1.showModal();
    }
});

// Save Product Image In The Data Base
async function showImageURL(files) {
    const storageRef = ref(storage, `${personName.value}|||${(Math.random() * 100 * Date.now()).toFixed()}`);
    try {
        const uploadImg = await uploadBytes(storageRef, files);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.log(error);
    }
}
