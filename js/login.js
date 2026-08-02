import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const togglePassword = document.getElementById("togglePassword");
const toggleIcon = document.getElementById("toggleIcon");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  const submitBtn = loginForm.querySelector("button[type='submit']");
  const originalBtnContent = submitBtn.innerHTML;
  const loadingOverlay = document.getElementById("loadingOverlay");

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>Logging in...`;
  loadingOverlay.classList.remove("d-none");
  document.body.classList.add("loading");
  togglePassword.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Login error:", error);

    if (error.code === "auth/too-many-requests") {
      loginError.textContent = "Too many failed attempts. Please wait a few minutes before trying again.";
    } else {
      loginError.textContent = "Invalid email or password.";
    }
    loginError.classList.remove("d-none");

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnContent;
    loadingOverlay.classList.add("d-none");
    document.body.classList.remove("loading");
    togglePassword.disabled = false;

    loginForm.classList.add("shake");
    setTimeout(() => loginForm.classList.remove("shake"), 400);
  }
});
// Helper function to handle focus & blur
const handleInputFocus = (input) => {
  input.classList.add("input-active");
};

const handleInputBlur = (input) => {
  input.classList.remove("input-active");
};

// Email input listeners
loginEmail.addEventListener("focus", () => handleInputFocus(loginEmail));
loginEmail.addEventListener("blur", () => handleInputBlur(loginEmail));

// Password input listeners
loginPassword.addEventListener("focus", () => handleInputFocus(loginPassword));
loginPassword.addEventListener("blur", () => handleInputBlur(loginPassword));

// Password visibility toggle
togglePassword.addEventListener("click", () => {
  const isPassword = loginPassword.type === "password";
  loginPassword.type = isPassword ? "text" : "password";
  toggleIcon.classList.toggle("bi-eye");
  toggleIcon.classList.toggle("bi-eye-slash");
});

import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const forgotPasswordLink = document.getElementById("forgotPasswordLink");

forgotPasswordLink.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = loginEmail.value.trim();
  if (!email) {
    alert("Please enter your email address first, then click 'Forgot password?'");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert(
      "A password reset email has been sent, if an account with that email exists. Check your spam folder if you don't see it in your inbox.",
    );
  } catch (error) {
    console.error("Password reset error:", error);
    alert("Something went wrong. Please try again.");
  }
});
