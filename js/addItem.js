import { t } from "./i18nHelper.js";
const addItemBtn = document.getElementById("addItemBtn");
const itemsTableBody = document.getElementById("itemsTableBody");

let itemCount = 0;

addItemBtn.addEventListener("click", () => {
  const nameInput = document.getElementById("itemName");
  const qtyInput = document.getElementById("itemQuantity");
  const photoInput = document.getElementById("itemPhoto");

  const name = nameInput.value.trim();
  const qty = qtyInput.value.trim();
  const photo = photoInput.value.trim();

  if (!name || !qty) {
    alert(t("fill_name_qty"));
    return;
  }

  const currentItemCount = itemsTableBody.querySelectorAll("tr").length;
  if (currentItemCount >= 30) {
    alert(t("max_items_reached"));
    return;
  }
  itemCount++;

  const row = document.createElement("tr");
  row.innerHTML = `
  <td>${itemCount}</td>
  <td>${name}</td>
  <td>${qty}</td>
  <td>${photo ? `<a href="#" class="view-photo" data-photo="${photo}">View</a>` : "-"}</td>
  <td>
    <div class="dropdown">
      <button class="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-three-dots-vertical"></i>
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item edit-item" href="#">Edit line</a></li>
        <li><a class="dropdown-item delete-item text-danger" href="#">Delete line</a></li>
      </ul>
    </div>
  </td>
`;

  itemsTableBody.appendChild(row);
  checkSaveButtonVisibility();

  row.classList.add("row-highlight");
  setTimeout(() => row.classList.remove("row-highlight"), 2000);

  nameInput.value = "";
  qtyInput.value = "";
  photoInput.value = "";
  nameInput.focus();
});

itemsTableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-item")) {
    e.preventDefault();
    const row = e.target.closest("tr");
    row.remove();
    renumberRows();
  }

  if (e.target.classList.contains("delete-item")) {
    e.preventDefault();
    const row = e.target.closest("tr");
    row.remove();
    renumberRows();
    checkSaveButtonVisibility();
  }

  if (e.target.classList.contains("edit-item")) {
    e.preventDefault();
    const row = e.target.closest("tr");
    enableEditMode(row);
  }

  if (e.target.classList.contains("confirm-edit")) {
    e.preventDefault();
    const row = e.target.closest("tr");
    saveEditMode(row);
  }
});

function enableEditMode(row) {
  const nameCell = row.cells[1];
  const qtyCell = row.cells[2];
  const photoCell = row.cells[3];

  const currentName = nameCell.textContent;
  const currentQty = qtyCell.textContent;
  const currentPhoto = photoCell.textContent === "-" ? "" : photoCell.textContent;

  nameCell.innerHTML = `<input type="text" class="form-control form-control-sm" value="${currentName}">`;
  qtyCell.innerHTML = `<input type="number" class="form-control form-control-sm" value="${currentQty}" min="1">`;
  photoCell.innerHTML = `<input type="url" class="form-control form-control-sm" value="${currentPhoto}">`;

  row.cells[4].innerHTML = `<button class="btn btn-success btn-sm confirm-edit">Confirm</button>`;
}

function saveEditMode(row) {
  const nameInput = row.cells[1].querySelector("input");
  const qtyInput = row.cells[2].querySelector("input");
  const photoInput = row.cells[3].querySelector("input");

  const newName = nameInput.value.trim();
  const newQty = qtyInput.value.trim();
  const newPhoto = photoInput.value.trim();

  if (!newName || !newQty) {
    alert(t("name_qty_empty"));
    return;
  }

  row.cells[1].textContent = newName;
  row.cells[2].textContent = newQty;
  row.cells[3].innerHTML = newPhoto
    ? `<a href="#" class="view-photo" data-photo="${newPhoto}">View</a>`
    : "-";
  row.cells[4].innerHTML = `
    <div class="dropdown">
      <button class="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="bi bi-three-dots-vertical"></i>
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item edit-item" href="#">${t("edit_line")}</a></li>
        <li><a class="dropdown-item delete-item text-danger" href="#">${t("delete_line")}</a></li>
      </ul>
    </div>
  `;
}

function renumberRows() {
  const rows = itemsTableBody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    row.cells[0].textContent = index + 1;
  });
}

function checkSaveButtonVisibility() {
  const remainingRows = itemsTableBody.querySelectorAll("tr").length;
  const saveListBtn = document.getElementById("saveListBtn");
  const noItemsText = document.getElementById("noItemsText");

  saveListBtn.disabled = remainingRows === 0;
  noItemsText.classList.toggle("d-none", remainingRows > 0);
}

document.body.addEventListener("click", (e) => {
  const photoLink = e.target.closest(".view-photo");
  if (photoLink) {
    e.preventDefault();
    document.getElementById("photoModalImg").src = photoLink.dataset.photo;
    bootstrap.Modal.getOrCreateInstance(document.getElementById("photoModal")).show();
  }
});
