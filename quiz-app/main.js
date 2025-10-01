"use strict";

// Fragen-Array
let questionArray = [
  {
    question: "Was ist die Hauptstadt von Deutschland?",
    answer: ["Berlin", "Hamburg", "München", "Hannover"],
  },
  {
    question: "Welcher Fluss fließt durch die ägyptische Hauptstadt Kairo?",
    answer: ["Nil", "Rhein", "Donau", "Themse"],
  },
  {
    question:
      "Wie viele Spieler hat eine Eishockeymannschaft auf dem Eis (ohne Torwart)?",
    answer: ["5", "4", "6", "7"],
  },
  {
    question: "Was ist das flächenmäßig kleinste Land der Welt?",
    answer: ["Vatikanstadt", "Monaco", "San Marino", "Liechtenstein"],
  },
  {
    question: "Wer schrieb die weltberühmte Fabel 'Der kleine Prinz'?",
    answer: [
      "Antoine de Saint-Exupéry",
      "Albert Camus",
      "Victor Hugo",
      "Jules Verne",
    ],
  },
  {
    question: "Welches ist das einzige Säugetier, das fliegen kann?",
    answer: ["Fledermaus", "Gleithörnchen", "Flughund", "Vogelspinne"],
  },
  {
    question: "Was ist der höchste Berg Afrikas?",
    answer: ["Kilimandscharo", "Mount Kenia", "Mount Everest", "Mont Blanc"],
  },
  {
    question: "In welchem Jahr fiel die Berliner Mauer?",
    answer: ["1989", "1988", "1990", "1991"],
  },
  {
    question: "Welches Metall hat das chemische Symbol 'Au'?",
    answer: ["Gold", "Silber", "Eisen", "Aluminium"],
  },
  {
    question:
      "Welche Farbe hat der Hauptdarsteller in der Zeichentrickserie 'Die Simpsons'?",
    answer: ["Gelb", "Blau", "Grün", "Orange"],
  },
  {
    question: "Welcher Komponist ist bekannt für die 'Mondscheinsonate'?",
    answer: [
      "Ludwig van Beethoven",
      "Wolfgang Amadeus Mozart",
      "Johann Sebastian Bach",
      "Frédéric Chopin",
    ],
  },
];

let correctButton;

// Listener Load Page
document.addEventListener("DOMContentLoaded", appendQuestion);

// Zufällige Frage auswählen und Antworten mixen
function randomQuestion() {
  const questionHash =
    questionArray[Math.floor(Math.random() * questionArray.length)];
  return questionHash;
}

function appendQuestion() {
  const questionHash = randomQuestion();
  const question = questionHash.question;

  let rndArray = [0, 1, 2, 3];
  let randomIndex;

  randomIndex = Math.floor(Math.random() * rndArray.length);
  const [positionOne] = rndArray.splice(randomIndex, 1);

  randomIndex = Math.floor(Math.random() * rndArray.length);
  const [positionTwo] = rndArray.splice(randomIndex, 1);

  randomIndex = Math.floor(Math.random() * rndArray.length);
  const [positionThree] = rndArray.splice(randomIndex, 1);

  randomIndex = Math.floor(Math.random() * rndArray.length);
  const [positionFour] = rndArray.splice(randomIndex, 1);

  if (positionOne === 0) {
    correctButton = "answer-one";
  } else if (positionTwo === 0) {
    correctButton = "answer-two";
  } else if (positionThree === 0) {
    correctButton = "answer-three";
  } else if (positionFour === 0) {
    correctButton = "answer-four";
  }

  // Ausgabe Bauen!
  const newQuestion = document.createElement("div");
  newQuestion.classList.add("question");
  newQuestion.textContent = question;

  const newAnswerContainer = document.createElement("div");
  newAnswerContainer.classList.add("answer-container");

  const newButtonOne = document.createElement("button");
  newButtonOne.classList.add("btn", "btn-answer");
  newButtonOne.setAttribute(
    "onclick",
    `checkAnswer(${positionOne}, "answer-one")`
  );
  newButtonOne.textContent = questionHash.answer[positionOne];
  newButtonOne.id = "answer-one";

  const newButtonTwo = document.createElement("button");
  newButtonTwo.classList.add("btn", "btn-answer");
  newButtonTwo.setAttribute(
    "onclick",
    `checkAnswer(${positionTwo}, "answer-two")`
  );
  newButtonTwo.textContent = questionHash.answer[positionTwo];
  newButtonTwo.id = "answer-two";

  const newButtonThree = document.createElement("button");
  newButtonThree.classList.add("btn", "btn-answer");
  newButtonThree.setAttribute(
    "onclick",
    `checkAnswer(${positionThree}, "answer-three")`
  );
  newButtonThree.textContent = questionHash.answer[positionThree];
  newButtonThree.id = "answer-three";

  const newButtonFour = document.createElement("button");
  newButtonFour.classList.add("btn", "btn-answer");
  newButtonFour.setAttribute(
    "onclick",
    `checkAnswer(${positionFour}, "answer-four")`
  );
  newButtonFour.textContent = questionHash.answer[positionFour];
  newButtonFour.id = "answer-four";

  newAnswerContainer.appendChild(newButtonOne);
  newAnswerContainer.appendChild(newButtonTwo);
  newAnswerContainer.appendChild(newButtonThree);
  newAnswerContainer.appendChild(newButtonFour);

  const newQuestionContainer = document.createElement("div");
  newQuestionContainer.id = "question-container";
  newQuestionContainer.appendChild(newQuestion);
  newQuestionContainer.appendChild(newAnswerContainer);

  const oldQuestionContainer = document.getElementById("question-container");
  oldQuestionContainer.replaceWith(newQuestionContainer);
  console.log(newQuestionContainer);
}

//  Prüfe ob die Antwort richtig oder Falsch war
function checkAnswer(answer, elementId) {
  // Antwort 0 ist immer richtig!
  if (answer === 0) {
    answerCorrect(elementId);
    // Wenn die Lösung gefordert wird
  } else if (answer === 99) {
    answerCorrect(correctButton);
    // Wenn die Antwort falsch war
  } else {
    answerIncorrect(elementId);
  }

  // Entferne die onclick-Funktionen
  const buttonOne = document.getElementById("answer-one");
  buttonOne.removeAttribute("onclick");
  const buttonTwo = document.getElementById("answer-two");
  buttonTwo.removeAttribute("onclick");
  const buttonThree = document.getElementById("answer-three");
  buttonThree.removeAttribute("onclick");
  const buttonFour = document.getElementById("answer-four");
  buttonFour.removeAttribute("onclick");
  const buttonSolution = document.getElementById("solution");
  buttonFour.removeAttribute("onclick");
}

// Korrekte
function answerCorrect(elementId) {
  const button = document.getElementById(elementId);
  button.classList.add("correct");
}

function answerIncorrect(elementId) {
  const button = document.getElementById(elementId);
  button.classList.add("incorrect");
  const buttonCorrect = document.getElementById(correctButton);
  buttonCorrect.classList.add("correct");
}
