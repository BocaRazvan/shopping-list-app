import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  doc,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { t } from "./i18nHelper.js";

const confirmSaveBtn = document.getElementById("confirmSaveBtn");

confirmSaveBtn.addEventListener("click", async () => {
  const listName = document.getElementById("listName").value.trim();
  const storeLocation = document.getElementById("storeLocation").value;
  const listDate = document.getElementById("listDate").value;

  if (!listName || !storeLocation || !listDate) {
    alert(t("fill_save_fields"));
    return;
  }

  const items = [];
  document.querySelectorAll("#itemsTableBody tr").forEach((row) => {
    const photoLink = row.cells[3].querySelector(".view-photo");
    items.push({
      name: row.cells[1].textContent,
      quantity: row.cells[2].textContent,
      photo: photoLink ? photoLink.dataset.photo : "",
    });
  });

  const today = new Date().toISOString().split("T")[0];
  const counterRef = doc(db, "counters", `${today}_${auth.currentUser.uid}`);
  const newListRef = doc(collection(db, "lists"));

  try {
    await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      const currentCount = counterSnap.exists() ? counterSnap.data().count : 0;

      if (currentCount >= 30) {
        throw new Error("DAILY_LIMIT_REACHED");
      }

      transaction.set(newListRef, {
        listName,
        storeLocation,
        listDate,
        items,
        createdAt: new Date(),
        createdBy: auth.currentUser.email,
      });

      transaction.set(counterRef, { count: currentCount + 1 }, { merge: true });
    });

    alert(t("list_saved"));
    window.location.href = "index.html";
  } catch (error) {
    if (error.message === "DAILY_LIMIT_REACHED") {
      alert(t("daily_limit_reached"));
    } else {
      console.error("Error saving list:", error);
      alert(t("save_error"));
    }
  }
});
