"use strict";

// Globale Variablen
const QUESTION_FILE_PATH = "question.json";
const QUESTION_STORAGE_KEY = "quizQuestions";
const ID_STORAGE_KEY = "quizIds";
let questionArray = [];
let questionArrayIds = [];
let currentQuestionObject = 0;

// Listener Load Page
document.addEventListener("DOMContentLoaded", initializeQuiz);

async function loadQuestionsFromFile() {
  console.log("Laden Daten aus der JSON-Datei.");
  try {
    const response = await fetch(QUESTION_FILE_PATH);

    if (!response.ok) {
      throw new Error(`Fehler beim Laden: HTTP Status ${response.status}.`);
    }

    // .json() parst die Antwort und löst Fehler bei ungültigem JSON aus
    return await response.json();
  } catch (error) {
    console.error("Netzwerkfehler oder ungültiges JSON:", error.message);
    return [];
  }
}

// Aus dem LocalStorage laden
function loadQuestionsFromLocalStorage() {
  console.log("Lade Daten aus LocalStorage.");
  const loadedQuestions = JSON.parse(
    localStorage.getItem(QUESTION_STORAGE_KEY)
  );

  return loadedQuestions ? loadedQuestions : [];
}

// In das LocalStorage schreiben
function saveToLocalStorage() {
  console.log("Speichere Daten im LocalStorage.");
  localStorage.setItem(QUESTION_STORAGE_KEY, JSON.stringify(questionArray));
}

async function loadQuizData() {
  // 1. Versuch: Aus LocalStorage laden
  questionArray = loadQuestionsFromLocalStorage();

  if (questionArray.length > 0) {
    console.log("Quizdaten erfolgreich aus LocalStorage geladen.");
    console.log(questionArray);
    return;
  } else {
    console.log("Keine Daten geladen.");
    // 2. Fallback: Von der JSON-Datei laden
    const loadedQuestions = await loadQuestionsFromFile();
    if (loadedQuestions.length > 0) {
      questionArray = loadedQuestions;
      saveToLocalStorage();
    } else {
      console.error(
        "FEHLER: Quiz konnte nicht initialisiert werden, da keine Fragen geladen wurden."
      );
    }
  }
}

function loadQuestionIdsfromLocalStorage() {
  console.log("Lade Quiz-IDs.");
  const loadedIds = JSON.parse(localStorage.getItem(ID_STORAGE_KEY));

  if (loadedIds) {
    questionArrayIds = loadedIds;
  } else {
    writeNewQuestionIdsfromLocalStorage();
  }
}

function writeNewQuestionIdsfromLocalStorage() {
  for (let i = 0; i < questionArray.length; i++) {
    questionArrayIds.push(i);
  }

  // Schreibe frischen questionArrayIds
  localStorage.setItem(ID_STORAGE_KEY, JSON.stringify(questionArrayIds));
  console.log("Schreibe neue Quiz-IDs.");
}

// Starte die Initialisierung beim Laden der Seite
async function initializeQuiz() {
  // Quiz-Daten laden
  await loadQuizData();

  // Quiz-IDs laden oder erzeugen
  loadQuestionIdsfromLocalStorage();

  // Quiz starten
  appendQuestion();
}

// Zufällige Frage auswählen
function randomQuestion() {
  if (questionArrayIds.length === 0) {
    writeNewQuestionIdsfromLocalStorage();
  }

  const randomQuestionIdsPosition = Math.floor(
    Math.random() * questionArrayIds.length
  );

  const randomQuestionIndex = questionArrayIds[randomQuestionIdsPosition];

  questionArrayIds.splice(randomQuestionIdsPosition, 1);

  // In LocalStorage speichern
  localStorage.setItem(ID_STORAGE_KEY, JSON.stringify(questionArrayIds));

  return randomQuestionIndex;
}

// Knuth-Shuffle für die Antworten (von Google)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fragen und Antworten posten
function appendQuestion() {
  const questionId = randomQuestion();
  currentQuestionObject = questionArray[questionId];

  let answerIndexArray = [0, 1, 2, 3];
  shuffleArray(answerIndexArray);

  // Ausgabe Bauen!
  const newQuestionDiv = document.createElement("div");
  newQuestionDiv.classList.add("question");
  newQuestionDiv.textContent = currentQuestionObject.question;

  const newAnswerContainer = document.createElement("div");
  newAnswerContainer.classList.add("answer-container");

  // Buttons bauen
  const newButtonOne = createButton(answerIndexArray[0]);
  newButtonOne.id = "answer-one";
  newButtonOne.addEventListener("click", () => {
    checkAnswer(answerIndexArray[0], "answer-one");
  });

  const newButtonTwo = createButton(answerIndexArray[1]);
  newButtonTwo.id = "answer-two";
  newButtonTwo.addEventListener("click", () => {
    checkAnswer(answerIndexArray[1], "answer-two");
  });

  const newButtonThree = createButton(answerIndexArray[2]);
  newButtonThree.id = "answer-three";
  newButtonThree.addEventListener("click", () => {
    checkAnswer(answerIndexArray[2], "answer-three");
  });

  const newButtonFour = createButton(answerIndexArray[3]);
  newButtonFour.id = "answer-four";
  newButtonFour.addEventListener("click", () => {
    checkAnswer(answerIndexArray[3], "answer-four");
  });

  newAnswerContainer.appendChild(newButtonOne);
  newAnswerContainer.appendChild(newButtonTwo);
  newAnswerContainer.appendChild(newButtonThree);
  newAnswerContainer.appendChild(newButtonFour);

  const newQuestionContainer = document.createElement("div");
  newQuestionContainer.id = "question-container";
  newQuestionContainer.appendChild(newQuestionDiv);
  newQuestionContainer.appendChild(newAnswerContainer);

  const oldQuestionContainer = document.getElementById("question-container");
  oldQuestionContainer.replaceWith(newQuestionContainer);
  console.log(newQuestionContainer);

  const buttonSolution = document.getElementById("solution");
  buttonSolution.setAttribute("onclick", "findCorrectAnswerButton()");
}

function createButton(answerIndex) {
  const newButton = document.createElement("button");
  newButton.classList.add("btn", "btn-answer");
  newButton.dataset.answerIndex = answerIndex;
  // @@ Listener eingerichtet
  // newButton.setAttribute("onclick", `checkAnswer()`);
  newButton.textContent = currentQuestionObject.answers[answerIndex].answer;

  return newButton;
}

//  Prüfe ob die Antwort richtig oder Falsch war
function checkAnswer(answerIndex, button) {
  if (currentQuestionObject.answers[answerIndex].isCorrect) {
    answerCorrect(button);
    deactivateAnswerButtons();
  } else {
    answerIncorrect(button);
  }
}

// Nur korrekten Button markieren
function answerCorrect(buttonId) {
  const button = document.getElementById(buttonId);
  button.classList.add("correct");
}

// Falschen und korrekten Button markieren
function answerIncorrect(buttonId) {
  const button = document.getElementById(buttonId);
  button.classList.add("incorrect");

  // Suche den richtigen Antwort-Button
  findCorrectAnswerButton();
}

// Finde die richtige Antwort
function findCorrectAnswerIndex() {
  for (let i = 0; i < currentQuestionObject.answers.length; i++) {
    if (currentQuestionObject.answers[i].isCorrect) {
      return i;
    }
  }
}

// Finde den richtigen Antwort-Button
function findCorrectAnswerButton() {
  const correctIndex = findCorrectAnswerIndex();

  const correctButton = document.querySelector(
    `.btn-answer[data-answer-index="${correctIndex}"]`
  );

  answerCorrect(correctButton.id);
  deactivateAnswerButtons();
}

function deactivateAnswerButtons() {
  // Wähle alle Buttons mit der Klasse 'btn-answer'
  const answerButtons = document.querySelectorAll(".btn-answer");

  // Gehe durch alle Buttons und deaktiviere sie
  answerButtons.forEach((button) => {
    button.disabled = true;
  });
}
