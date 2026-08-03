import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { t } from "./i18nHelper.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.body.classList.add("auth-checked");

  const userInfo = document.getElementById("userInfo");
  if (userInfo) {
    userInfo.textContent = `${t("logged_in_as")} ${user.email}`;
  }
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    await signOut(auth);
    window.location.href = "login.html";
  });
}
