const dateInput = document.getElementById("listDate");
const today = new Date().toISOString().split("T")[0];

dateInput.value = today;
