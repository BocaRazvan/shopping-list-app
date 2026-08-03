const darkModeToggle = document.getElementById("darkModeToggle");
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "light";
htmlElement.setAttribute("data-bs-theme", savedTheme);
updateIcon(savedTheme);

darkModeToggle.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  htmlElement.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateIcon(newTheme);
});

function updateIcon(theme) {
  const icon = darkModeToggle.querySelector("i");
  icon.className = theme === "dark" ? "bi bi-sun" : "bi bi-lightbulb";
}