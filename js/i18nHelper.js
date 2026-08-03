import { translations } from "./translations.js";

function t(key) {
  const lang = localStorage.getItem("lang") || "en";
  return (translations[lang] && translations[lang][key]) || key;
}

export { t };
