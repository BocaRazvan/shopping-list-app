import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  doc,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const confirmSaveBtn = document.getElementById("confirmSaveBtn");

confirmSaveBtn.addEventListener("click", async () => {
  const listName = document.getElementById("listName").value.trim();
  const storeLocation = document.getElementById("storeLocation").value;
  const listDate = document.getElementById("listDate").value;

  if (!listName || !storeLocation || !listDate) {
    alert("Please fill in the list name, store, and date before saving.");
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

    alert("List saved successfully!");
    window.location.href = "index.html";
  } catch (error) {
    if (error.message === "DAILY_LIMIT_REACHED") {
      alert("The daily limit of 30 new lists has been reached. Please try again tomorrow.");
    } else {
      console.error("Error saving list:", error);
      alert("Something went wrong while saving. Check the console for details.");
    }
  }
});
