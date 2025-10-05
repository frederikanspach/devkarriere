"use strict";

const QUESTION_FILE_PATH = "question.json";
const QUESTION_STORAGE_KEY = "quizQuestions";
const ID_STORAGE_KEY = "quizIds";
const SCORE_STORAGE_KEY = "quizScore";
let questionArray = [];
let questionArrayIds = [];
let currentQuestionObject = 0;
let correctCount = 0;
let incorrectCount = 0;
let solutionCount = 0;

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

function loadQuestionsFromLocalStorage() {
  console.log("Lade Daten aus LocalStorage.");
  const loadedQuestions = JSON.parse(
    localStorage.getItem(QUESTION_STORAGE_KEY)
  );

  return loadedQuestions ? loadedQuestions : [];
}

function saveQuestionsToLocalStorage() {
  console.log("Speichere Daten im LocalStorage.");
  localStorage.setItem(QUESTION_STORAGE_KEY, JSON.stringify(questionArray));
}

function saveScoreToLocalStorage() {
  console.log("Speichere Punktestand im LocalStorage.");

  const scoreData = {
    correct: correctCount,
    incorrect: incorrectCount,
    solution: solutionCount,
  };

  localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scoreData));
}

function loadScoreFromLocalStorage() {
  const loadedScore = localStorage.getItem(SCORE_STORAGE_KEY);
  if (loadedScore) {
    const scoreData = JSON.parse(loadedScore);
    correctCount = scoreData.correct;
    incorrectCount = scoreData.incorrect;
    solutionCount = scoreData.solution;
    console.log("Punktestand aus LocalStorage geladen.");
  } else {
    // Starte mit 0, falls kein Score gefunden
    correctCount = 0;
    incorrectCount = 0;
    solutionCount = 0;
    console.log("Erzeuge neuen Punktestand.");
  }

  updateScoreDisplay();
}

// Ladelogik
async function loadQuizData() {
  loadScoreFromLocalStorage();

  // Versuche aus LocalStorage zu laden
  questionArray = loadQuestionsFromLocalStorage();

  if (questionArray.length > 0) {
    console.log("Quizdaten erfolgreich aus LocalStorage geladen.");
    console.log(questionArray);
    return;
  } else {
    console.log("Keine Daten gefunden.");
    // Fallback: Von der JSON-Datei laden
    const loadedQuestions = await loadQuestionsFromFile();
    if (loadedQuestions.length > 0) {
      questionArray = loadedQuestions;
      saveQuestionsToLocalStorage();
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
    writeNewQuestionIdsToLocalStorage();
  }
}

// Schreibe frischen questionArrayIds
function writeNewQuestionIdsToLocalStorage() {
  for (let i = 0; i < questionArray.length; i++) {
    questionArrayIds.push(i);
  }

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
    writeNewQuestionIdsToLocalStorage();
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

  // Nach dem Lösungsvideo geändert
  answerIndexArray.forEach((id) => {
    const newButton = document.createElement("button");
    newButton.classList.add("btn", "btn-answer");
    newButton.textContent = currentQuestionObject.answers[id].answer;
    newButton.id = id;

    newButton.addEventListener("click", () => {
      checkAnswer(id);
    });

    newAnswerContainer.appendChild(newButton);
  });

  const newQuestionContainer = document.createElement("div");
  newQuestionContainer.id = "question-container";
  newQuestionContainer.appendChild(newQuestionDiv);
  newQuestionContainer.appendChild(newAnswerContainer);

  const oldQuestionContainer = document.getElementById("question-container");
  oldQuestionContainer.replaceWith(newQuestionContainer);

  // Den Lösungsbutton setzen und disabled entfernen!
  const buttonSolution = document.getElementById("solution");
  buttonSolution.setAttribute("onclick", "solution()");
  buttonSolution.removeAttribute("disabled");
}

//  Prüfe ob die Antwort richtig oder Falsch ist
function checkAnswer(id) {
  const correctAnswer = currentQuestionObject.answers.find((answer) => {
    return answer.isCorrect;
  });

  if (correctAnswer.answerId === id) {
    document.getElementById(id).classList.add("correct");

    correctCount++;
  } else {
    document.getElementById(id).classList.add("incorrect");
    document.getElementById(correctAnswer.answerId).classList.add("correct");

    incorrectCount++;
  }
  deactivateAnswerButtons();
  updateScoreDisplay();
  saveScoreToLocalStorage();
}

// Lösungsfunktion um den Zähler hoch zu zählen
function solution() {
  const correctAnswer = currentQuestionObject.answers.find((answer) => {
    return answer.isCorrect;
  });
  document.getElementById(correctAnswer.answerId).classList.add("correct");

  solutionCount++;
  updateScoreDisplay();
  saveScoreToLocalStorage();
}

function deactivateAnswerButtons() {
  const answerButtons = document.querySelectorAll(".btn-answer");

  // Gehe durch den Buttons-Array und deaktiviere alle
  answerButtons.forEach((button) => {
    button.disabled = true;
  });

  // Auch den Lösungs-Button deaktivieren (damit der Counter nicht hochgezählt wird)
  const solutionButton = document.getElementById("solution");
  solutionButton.disabled = true;
}

function updateScoreDisplay() {
  const scoreTotalCount = correctCount + incorrectCount + solutionCount;

  const newScoreDiv = document.createElement("div");
  newScoreDiv.classList.add("score");
  newScoreDiv.textContent = `Punkte: Richtig: ${correctCount}, Falsch: ${incorrectCount}, Lösung: ${solutionCount}, Gesamt: ${scoreTotalCount}`;

  let [oldScoreDiv] = document.getElementsByClassName("score");
  oldScoreDiv.replaceWith(newScoreDiv);
}

function resetScore() {
  const isConfirmed = confirm(
    "Es werden alle Punkte gelöscht!\n\n Fortfahren?"
  );

  if (isConfirmed) {
    correctCount = 0;
    incorrectCount = 0;
    solutionCount = 0;

    saveScoreToLocalStorage();
    updateScoreDisplay();
    alert("Alle Punkte wurden gelöscht.");
  }
}

function deleteLocalStorage() {
  const isConfirmed = confirm(
    "Es werden alle Daten aus dem Local Storage entfernt (Fragen, IDs, Punktestand) gelöscht!\n\n Fortfahren?"
  );

  if (isConfirmed) {
    localStorage.clear();
    alert("Der gesamte lokale Speicher wurde erfolgreich gelöscht.");
    window.location.reload();
  }
}
