"use strict";

const noteArray = [
  {
    title: "Kleine Notiz 1",
    content: "Lorem Ipsum",
    id: 1,
    lastUpdated: 1693149614492,
  },
  {
    title: "Große Notiz 2",
    content: "Lorem Ipsum",
    id: 2,
    lastUpdated: 1693149622194,
  },
  {
    title: "Eine Notiz 3",
    content: "Lorem Ipsum",
    id: 3,
    lastUpdated: 1693149629935,
  },
];

// Listener Load Page
document.addEventListener("DOMContentLoaded", appendNotesToHTML);

// Notiz-Daten einlesen
function loadNotesFromLocalStorage() {
  // Notizen Nach Datum sortieren
  return noteArray;
}

// Notiz-Daten schreiben: LocalStorage

// Notiz-Daten in HTML anzeigen
function appendNotesToHTML() {
  const sortedNoteArray = loadNotesFromLocalStorage();

  const newSideList = document.createElement("div");
  newSideList.classList.add("side-list");

  sortedNoteArray.forEach((note) => {
    const newNoteSection = document.createElement("section");
    newNoteSection.classList.add("side-box");
    newNoteSection.id = note.id;

    const newNoteHeader = document.createElement("h2");
    newNoteHeader.textContent = note.title;

    const newNoteParagraph = document.createElement("p");
    newNoteParagraph.textContent = note.content;

    const newNoteLastUpdate = document.createElement("div");
    newNoteLastUpdate.classList.add("time");
    newNoteLastUpdate.textContent = note.lastUpdated;

    newNoteSection.appendChild(newNoteHeader);
    newNoteSection.appendChild(newNoteParagraph);
    newNoteSection.appendChild(newNoteLastUpdate);

    newNoteSection.addEventListener("click", () => {
      showNoteInEditMode(note.id);
    });

    newSideList.appendChild(newNoteSection);
  });

  const oldSideList = document.getElementsByClassName("side-list");
  oldSideList[0].replaceWith(newSideList);
}

function showNoteInEditMode(noteId) {
  let editNoteArray;

  for (let item of noteArray) {
    if (item.id === noteId) {
      editNoteArray = item;
    }
  }

  // Notiz-Input-Feld erstellen
  const newInputNoteHeader = document.createElement("input");
  newInputNoteHeader.id = "input-note-header";
  newInputNoteHeader.type = "text";
  newInputNoteHeader.placeholder = "Überschrift eingeben...";
  newInputNoteHeader.required = true;
  newInputNoteHeader.value = editNoteArray.title;

  const oldInputNoteHeader = document.getElementById("input-note-header");
  oldInputNoteHeader.replaceWith(newInputNoteHeader);

  // Notiz-Input-Textarea erstellen
  const newInputNoteBody = document.createElement("textarea");
  newInputNoteBody.id = "input-note-body";
  newInputNoteBody.placeholder = "Fang' an eine Notiz zu erstellen";
  newInputNoteBody.required = true;
  newInputNoteBody.value = editNoteArray.content;

  const oldInputNoteBody = document.getElementById("input-note-body");
  oldInputNoteBody.replaceWith(newInputNoteBody);

  // Save-Button erstellen
  const newSaveButton = document.createElement("button");
  newSaveButton.id = "save-note";
  newSaveButton.classList.add("button-option");
  newSaveButton.dataset.id = editNoteArray.id;

  const imgSave = document.createElement("img");
  imgSave.src = "img/save-icon.png";
  imgSave.alt = "Neue Notiz speichern";
  newSaveButton.appendChild(imgSave);

  const oldSaveButton = document.getElementById("save-note");
  oldSaveButton.replaceWith(newSaveButton);

  newSaveButton.addEventListener("click", () => {
    saveCurrentNote(editNoteArray.id);
  });

  console.log(newSaveButton);

  // Delete-Button erstellen
  const newDeleteButton = document.createElement("button");
  newDeleteButton.id = "delete-note";
  newDeleteButton.classList.add("button-option");
  newDeleteButton.dataset.id = editNoteArray.id;

  const imgDelete = document.createElement("img");
  imgDelete.src = "img/delete-icon.png";
  imgDelete.alt = "Notiz löschen";
  newDeleteButton.appendChild(imgDelete);

  const oldDeleteButton = document.getElementById("delete-note");
  oldDeleteButton.replaceWith(newDeleteButton);

  newDeleteButton.addEventListener("click", () => {
    saveCurrentNote(editNoteArray.id);
  });
  console.log(newDeleteButton);
}

// Geänderte Notiz speichern
function saveCurrentNote(id) {
  console.log(id);
}
