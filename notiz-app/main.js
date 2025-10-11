"use strict";

const NOTE_STORAGE_KEY = "noteApp";
let noteArray = [];

// Listener
document.addEventListener("DOMContentLoaded", init);

const saveNote = document.getElementById("save-note");
saveNote.addEventListener("click", () => {
  saveCurrentNote();
});

const deleteNote = document.getElementById("delete-note");
deleteNote.addEventListener("click", () => {
  deleteCurrentNote();
});

const [newNoteButton] = document.getElementsByClassName("new-note-button");
newNoteButton.addEventListener("click", () => {
  resetNoteEditMode();
});

function init() {
  loadFromLocalStorage();
  appendNotesToHTML();
}

// Daten aus dem localStorage laden
function loadFromLocalStorage() {
  noteArray = JSON.parse(localStorage.getItem(NOTE_STORAGE_KEY)) || [];
}

// Daten in das localStorage schreiben
function saveToLocalStorage() {
  localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(noteArray));
}

// Notiz-Daten in HTML anzeigen
function appendNotesToHTML() {
  console.log(noteArray);
  // Sortieren des Arrays absteigend
  const sortedNoteArray = noteArray.sort(
    (a, b) => b.lastUpdated - a.lastUpdated
  );

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
    newNoteLastUpdate.textContent = formatDate(note.lastUpdated);

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

function formatDate(date) {
  const dateObject = new Date(date);

  // Formatieren mit toLocaleString() für deutsche Darstellung
  const formattedDate = dateObject.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return formattedDate;
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
  newInputNoteHeader.dataset.noteId = noteId;
  newInputNoteHeader.type = "text";
  newInputNoteHeader.placeholder = "Überschrift eingeben...";
  newInputNoteHeader.required = true;
  newInputNoteHeader.value = editNoteArray.title;

  const oldInputNoteHeader = document.getElementById("input-note-header");
  oldInputNoteHeader.replaceWith(newInputNoteHeader);

  // Notiz-Input-Textarea erstellen
  const newInputNoteBody = document.createElement("textarea");
  newInputNoteBody.id = "input-note-body";
  newInputNoteBody.dataset.noteId = noteId;
  newInputNoteBody.placeholder = "Fang' an eine Notiz zu erstellen";
  newInputNoteBody.required = true;
  newInputNoteBody.value = editNoteArray.content;

  const oldInputBody = document.getElementById("input-note-body");
  oldInputBody.replaceWith(newInputNoteBody);
}

function resetNoteEditMode() {
  // Notiz-Input-Feld leeren
  const newInputNoteHeader = document.createElement("input");
  newInputNoteHeader.id = "input-note-header";
  newInputNoteHeader.type = "text";
  newInputNoteHeader.placeholder = "Überschrift eingeben...";
  newInputNoteHeader.required = true;
  newInputNoteHeader.value = "";

  const oldInputNoteHeader = document.getElementById("input-note-header");
  oldInputNoteHeader.replaceWith(newInputNoteHeader);

  // Notiz-Input-Textarea leeren
  const newInputNoteBody = document.createElement("textarea");
  newInputNoteBody.id = "input-note-body";
  newInputNoteBody.placeholder = "Fang' an eine Notiz zu erstellen";
  newInputNoteBody.required = true;
  newInputNoteBody.value = "";

  const oldInputBody = document.getElementById("input-note-body");
  oldInputBody.replaceWith(newInputNoteBody);
}

// Geänderte Notiz speichern
function saveCurrentNote() {
  const currentNoteHeader = document.getElementById("input-note-header");
  const currentNoteBody = document.getElementById("input-note-body");
  let highesItemId;

  if (currentNoteHeader.dataset.noteId) {
    // Note update
    for (let item of noteArray) {
      console.log(item.id);
      if (Number(currentNoteHeader.dataset.noteId) === item.id) {
        item.title = currentNoteHeader.value;
        item.content = currentNoteBody.value;
        item.lastUpdated = Date.now();
        appendNotesToHTML();
        saveToLocalStorage();
        return;
      }
    }
  } else if (currentNoteHeader.value && currentNoteBody.value) {
    // new Note
    for (let item of noteArray) {
      if (highesItemId) {
        if (highesItemId.id < item.id) {
          highesItemId = item;
        }
      } else {
        highesItemId = item;
      }
    }

    const newNoteObject = {};
    newNoteObject.id = highesItemId ? highesItemId.id + 1 : 1;
    newNoteObject.title = currentNoteHeader.value;
    newNoteObject.content = currentNoteBody.value;
    newNoteObject.lastUpdated = Date.now();

    noteArray.push(newNoteObject);
    appendNotesToHTML();
    resetNoteEditMode();
    saveToLocalStorage();
  }
}

function deleteCurrentNote() {
  const deleteId = Number(
    document.getElementById("input-note-header").dataset.noteId
  );

  if (!deleteId) {
    return;
  }

  if (deleteId) {
    const deleteElement = noteArray.findIndex(
      (object) => object.id === deleteId
    );
    noteArray.splice(deleteElement, 1);
    console.log(noteArray);
    appendNotesToHTML();
    resetNoteEditMode();
    saveToLocalStorage();
  }
}
