import { translations } from "./translations.js";
import { auth } from "./firebaseConfig.js";
import { t } from "./i18nHelper.js";

const languageSelector = document.getElementById("languageSelector");

function applyTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  const userInfo = document.getElementById("userInfo");
  if (userInfo && auth.currentUser) {
    userInfo.textContent = `${t("logged_in_as")} ${auth.currentUser.email}`;
  }

  document.dispatchEvent(new CustomEvent("languageChanged"));
}

const savedLang = localStorage.getItem("lang") || "en";
languageSelector.value = savedLang;
applyTranslations(savedLang);

languageSelector.addEventListener("change", () => {
  const selectedLang = languageSelector.value;
  localStorage.setItem("lang", selectedLang);
  applyTranslations(selectedLang);
});
