import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"
import { auth, storage, db } from "./fbconfig.js";

const firstName = document.querySelector("#first-name");
const lastName = document.querySelector("#last-name");
const registrationEmail = document.querySelector("#registration-email");
const registrationPassword = document.querySelector("#registration-password");
const registrationImage = document.querySelector("#registration-image");
const registerButton = document.querySelector("#register-button");

// For User Reistration
registerButton.addEventListener("click", async (event) => {
    event.preventDefault();

    // Checking if the user has entered all required data
    if (firstName.value && lastName.value && registrationEmail.value && registrationPassword.value && registrationImage.files[0]) {

        // Disable the button and show the loader
        registerButton.disabled = true;
        registerButton.innerHTML = '<span class="loading loading-bars loading-md"></span> Registering...';

        // Getting User Data
        createUserWithEmailAndPassword(auth, registrationEmail.value, registrationPassword.value)
            .then(async (userCredential) => {
                const user = userCredential.user;
                const UserId = user.uid;
                console.log(UserId);

                // For Getting User Image URL From Firebase Storage
                let file = registrationImage.files[0];
                let url = null;
                if (file) {
                    url = await showImageURL(file, registrationEmail.value);
                    console.log("File URL:", url);
                }

                // Adding Data to Database
                try {
                    const docRef = await addDoc(collection(db, "users"), {
                        firstName: firstName.value,
                        lastName: lastName.value,
                        email: registrationEmail.value,
                        uid: user.uid,
                        profileImage: url,
                    });
                    console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
            })
            .finally(() => {
                // Re-enable the button and reset the text
                registerButton.disabled = false;
                registerButton.innerHTML = 'Register';
                // Show success modal and change page from registration to login
                my_modal_2.showModal();
            });

    } else {
        // Show modal if the form is incomplete
        my_modal_1.showModal();
    }
});

// Function For Save A User-Profile Image On The Database Storage
async function showImageURL(files) {
    const storageRef = ref(storage, registrationEmail.value);
    try {
        const uploadImg = await uploadBytes(storageRef, files);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.log(error);
    }
}
