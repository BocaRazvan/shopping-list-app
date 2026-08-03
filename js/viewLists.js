import { db } from "./firebaseConfig.js";
import {
  doc,
  deleteDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { t } from "./i18nHelper.js";

const listsContainer = document.getElementById("listsContainer");

let currentSnapshot;

async function loadLists() {
  const q = query(collection(db, "lists"), orderBy("createdAt", "desc"));
  currentSnapshot = await getDocs(q);

  listsContainer.innerHTML = "";

  currentSnapshot.forEach((docSnap, index) => {
    const list = docSnap.data();
    const listId = docSnap.id;

    const card = document.createElement("div");
    card.className = "card p-3 shadow mb-3 list-card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
    <div class="d-flex flex-column list-header" data-target="items-${listId}" style="cursor: pointer;">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-1 text-truncate" style="color: var(--bs-primary)">${list.listName}</h5>
        <button type="button" class="btn btn-outline-danger btn-sm delete-list" data-id="${listId}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <p class="mb-1 text-dark small"><strong>${list.storeLocation}</strong></p>
      <div class="text-start">
        <span class="badge bg-secondary-subtle text-primary-emphasis text-wrap d-inline-block text-start">
          ${t("created_by")} ${list.createdBy || "Unknown"} ${t("at_time")} ${list.createdAt ? new Date(list.createdAt.seconds * 1000).toLocaleString() : "Unknown time"}
        </span>
      </div>
    </div>

    <div class="collapse mt-3" id="items-${listId}">
      <ul class="list-group" data-list-id="${listId}">
        ${list.items
          .map(
            (item, itemIndex) => `
          <li class="list-group-item d-flex flex-column flex-sm-row align-items-start align-sm-center gap-2 ${item.bought ? "item-bought" : ""}" data-index="${itemIndex}" data-name="${item.name}" data-qty="${item.quantity}" data-photo="${item.photo || ""}">
  <div class="d-flex align-items-center gap-2 w-100">
    <input type="checkbox" class="form-check-input flex-shrink-0 item-checkbox" ${item.bought ? "checked" : ""}>
    <span class="item-name flex-grow-1 text-break">
      ${item.name} (${item.quantity})
      ${item.photo ? `<a href="#" class="view-photo ms-2" data-photo="${item.photo}">${t("view_photo")}</a>` : ""}
    </span>
    <div class="d-flex gap-1">
      <button type="button" class="btn btn-outline-primary btn-sm edit-item">
        <i class="bi bi-pencil"></i>
      </button>
      <button type="button" class="btn btn-outline-warning btn-sm delete-item">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  </div>
</li>
        `,
          )
          .join("")}
      </ul>
    </div>
  `;
    listsContainer.appendChild(card);
  });
}

loadLists();

listsContainer.addEventListener("click", async (e) => {
  const deleteListBtn = e.target.closest(".delete-list");
  const header = e.target.closest(".list-header");
  const editItemBtn = e.target.closest(".edit-item");
  const deleteItemBtn = e.target.closest(".delete-item");
  const confirmEditItemBtn = e.target.closest(".confirm-edit-item");

  if (deleteListBtn) {
    const confirmDelete = confirm(t("confirm_delete_list"));
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "lists", deleteListBtn.dataset.id));
      loadLists();
    } catch (error) {
      console.error("Error deleting list:", error);
      alert(t("delete_list_error"));
    }
    return;
  }

  if (editItemBtn) {
    const li = editItemBtn.closest("li");
    const nameSpan = li.querySelector(".item-name");

    const currentName = li.dataset.name;
    const currentQty = li.dataset.qty;
    const currentPhoto = li.dataset.photo;

    nameSpan.innerHTML = `
      <div class="d-flex flex-column flex-sm-row gap-2 mt-2 w-100">
        <input type="text" class="form-control form-control-sm edit-name-input" value="${currentName}" placeholder="Name">
        <input type="number" class="form-control form-control-sm edit-qty-input" value="${currentQty}" min="1" placeholder="Qty" style="max-width: 80px;">
        <input type="url" class="form-control form-control-sm edit-photo-input" value="${currentPhoto}" placeholder="Photo URL">
      </div>
    `;

    editItemBtn.classList.add("d-none");
    li.querySelector(".delete-item").classList.add("d-none");

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "btn btn-success btn-sm confirm-edit-item align-self-end mt-2";
    confirmBtn.innerHTML = `<i class="bi bi-check-lg"></i>`;
    li.appendChild(confirmBtn);
    return;
  }

  if (confirmEditItemBtn) {
    const li = confirmEditItemBtn.closest("li");
    const ul = li.closest("ul");
    const listId = ul.dataset.listId;
    const itemIndex = parseInt(li.dataset.index, 10);

    const newName = li.querySelector(".edit-name-input").value.trim();
    const newQty = li.querySelector(".edit-qty-input").value.trim();
    const newPhoto = li.querySelector(".edit-photo-input").value.trim();

    if (!newName || !newQty) {
      alert(t("name_qty_empty"));
      return;
    }

    const docSnap = currentSnapshot.docs.find((d) => d.id === listId);
    const list = docSnap.data();
    const updatedItems = [...list.items];
    updatedItems[itemIndex] = { name: newName, quantity: newQty, photo: newPhoto };

    try {
      await updateDoc(doc(db, "lists", listId), { items: updatedItems });
      loadLists();
    } catch (error) {
      console.error("Error updating item:", error);
      alert(t("save_item_error"));
    }
    return;
  }

  if (deleteItemBtn) {
    const li = deleteItemBtn.closest("li");
    const ul = li.closest("ul");
    const listId = ul.dataset.listId;
    const itemIndex = parseInt(li.dataset.index, 10);

    const confirmDelete = confirm(t("confirm_delete_item"));
    if (!confirmDelete) return;

    const docSnap = currentSnapshot.docs.find((d) => d.id === listId);
    const list = docSnap.data();
    const updatedItems = list.items.filter((_, index) => index !== itemIndex);

    try {
      await updateDoc(doc(db, "lists", listId), { items: updatedItems });
      loadLists();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(t("delete_item_error"));
    }
    return;
  }

  if (header) {
    const collapseEl = document.getElementById(header.dataset.target);
    bootstrap.Collapse.getOrCreateInstance(collapseEl).toggle();
  }
});

listsContainer.addEventListener("change", async (e) => {
  if (e.target.classList.contains("item-checkbox")) {
    const li = e.target.closest("li");
    const ul = li.closest("ul");
    const listId = ul.dataset.listId;
    const itemIndex = parseInt(li.dataset.index, 10);
    const isChecked = e.target.checked;

    li.classList.toggle("item-bought", isChecked);

    const docSnap = currentSnapshot.docs.find((d) => d.id === listId);
    const list = docSnap.data();
    const updatedItems = [...list.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], bought: isChecked };

    try {
      await updateDoc(doc(db, "lists", listId), { items: updatedItems });
    } catch (error) {
      console.error("Error updating item status:", error);
      alert(t("update_item_error"));
      li.classList.toggle("item-bought", !isChecked);
      e.target.checked = !isChecked;
    }
  }
});

document.body.addEventListener("click", (e) => {
  const photoLink = e.target.closest(".view-photo");
  if (photoLink) {
    e.preventDefault();
    document.getElementById("photoModalImg").src = photoLink.dataset.photo;
    bootstrap.Modal.getOrCreateInstance(document.getElementById("photoModal")).show();
  }
});

document.addEventListener("languageChanged", () => {
  loadLists();
});
