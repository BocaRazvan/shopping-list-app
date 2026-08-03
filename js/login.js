import { auth } from "./firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { t } from "./i18nHelper.js";

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const togglePassword = document.getElementById("togglePassword");
const toggleIcon = document.getElementById("toggleIcon");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

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
      loginError.textContent = t("too_many_requests");
    } else {
      loginError.textContent = t("invalid_credentials");
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

// Forgot password
forgotPasswordLink.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = loginEmail.value.trim();
  if (!email) {
    alert(t("enter_email_first"));
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert(t("reset_email_sent"));
  } catch (error) {
    console.error("Password reset error:", error);
    alert(t("reset_email_error"));
  }
});
