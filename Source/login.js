import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth } from "./fbconfig.js";

const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginButton = document.querySelector("#login-button");

loginButton.addEventListener("click", () => {
    if (loginEmail.value && loginPassword.value) {
        signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
            .then((userCredential) => {
                // const user = userCredential.user;
                window.open("../index.html", "_self");
            })
            .catch((error) => {
                alert(error.message);
            });
    } else {
        my_modal_1.showModal();
    }
})