let questions = [];

async function fetchUniqueValues() {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbxQTMBry6x66Gl_1vZxAISk0ulTB_W3kaQl49Jqnhp00L6ypAQVDIDM-2ZT1cNeoQ1a/exec?unique=true"
  );
  const uniqueValues = await response.json();

  populateDropdown("chapter", uniqueValues.chapters);
  document.getElementById("chapter").selectedIndex = 1;
}

function populateDropdown(id, values) {
  const dropdown = document.getElementById(id);
  dropdown.innerHTML = '<option value="">Choose Chapter</option>';
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    dropdown.appendChild(option);
  });
}

async function generateTest() {
  const chapter = document.getElementById("chapter").value;
  const numQuestions = document.getElementById("numQuestions").value;
  const submitBtn = document.getElementById("ContinueTest");
  submitBtn.innerText = "Loading...";

  let url =
    "https://script.google.com/macros/s/AKfycbxQTMBry6x66Gl_1vZxAISk0ulTB_W3kaQl49Jqnhp00L6ypAQVDIDM-2ZT1cNeoQ1a/exec?";
  if (chapter) url += `chapter=${chapter}`;

  const response = await fetch(url);
  const data = await response.json();
  questions = data.data.slice(0, numQuestions);

  showExamContainer();
}

document.addEventListener("DOMContentLoaded", fetchUniqueValues);
const data = [
  { marks: [286, 300], rank: [19, 1], percentile: [99.99826992, 100] },
  {
    marks: [280, 284],
    rank: [42, 23],
    percentile: [99.99617561, 99.99790569],
  },
  {
    marks: [268, 279],
    rank: [106, 64],
    percentile: [99.99034797, 99.99417236],
  },
  {
    marks: [250, 267],
    rank: [524, 108],
    percentile: [99.95228621, 99.99016586],
  },
  {
    marks: [231, 249],
    rank: [1385, 546],
    percentile: [99.87388626, 99.95028296],
  },
  {
    marks: [215, 230],
    rank: [2798, 1421],
    percentile: [99.74522293, 99.87060821],
  },
  {
    marks: [200, 214],
    rank: [4667, 2863],
    percentile: [99.57503767, 99.73930423],
  },
  {
    marks: [189, 199],
    rank: [6664, 4830],
    percentile: [99.39319714, 99.56019541],
  },
  {
    marks: [175, 188],
    rank: [10746, 7152],
    percentile: [99.02150308, 99.3487614],
  },
  {
    marks: [160, 174],
    rank: [16163, 11018],
    percentile: [98.52824811, 98.99673561],
  },
  {
    marks: [149, 159],
    rank: [21145, 16495],
    percentile: [98.07460288, 98.49801724],
  },
  {
    marks: [132, 148],
    rank: [32826, 22238],
    percentile: [97.0109678, 97.97507774],
  },
  {
    marks: [120, 131],
    rank: [43174, 33636],
    percentile: [96.0687115, 96.93721175],
  },
  {
    marks: [110, 119],
    rank: [54293, 44115],
    percentile: [95.05625037, 95.983027],
  },
  {
    marks: [102, 109],
    rank: [65758, 55269],
    percentile: [94.01228357, 94.96737888],
  },
  {
    marks: [95, 101],
    rank: [76260, 66999],
    percentile: [93.05600452, 93.89928202],
  },
  {
    marks: [89, 94],
    rank: [87219, 78111],
    percentile: [92.05811248, 92.88745828],
  },
  {
    marks: [79, 88],
    rank: [109329, 90144],
    percentile: [90.0448455, 91.79177119],
  },
  {
    marks: [62, 87],
    rank: [169542, 92303],
    percentile: [84.56203931, 91.59517945],
  },
  {
    marks: [41, 61],
    rank: [326517, 173239],
    percentile: [70.26839007, 84.22540213],
  },
  {
    marks: [1, 40],
    rank: [1025009, 334080],
    percentile: [6.66590786, 69.5797271],
  },
];

let currentQuestionIndex = 0;
let currentQuestionIndex2 = 0;
let questionStartTime = Date.now();
let timerDuration = 3 * 60 * 60; // 3 hours in seconds
let timerInterval;
let elapsedMinutes = 0;
let markedCount = 0;
let reviewedCount = 0;
let attemptedCount = 0;
let skippedCount = 0;
let questionsContainerStartTime = 0; // Variable to store the start time
let questionsContainerTimeSpent = 0; // Variable to store the total time spent

const maxNumericalAttempts = 20;
const numericalAttempts = {
  Physics: 0,
  Chemistry: 0,
  Maths: 0,
};

var userName;
const main = document.querySelector(".main");
const startBtn = document.querySelector(".start-test-btn");
const popupInfo = document.querySelector(".popup-info");
const exitBtn = document.querySelector(".exit-btn");
const continueBtn = document.querySelector(".continue-btn");

const questionDisplay = document.getElementById("question-display");
const prevQuestionButton = document.getElementById("prev-question");
const nextQuestionButton = document.getElementById("next-question");
const timerElement = document.getElementById("timer");
const sidebar = document.getElementById("sidebar");
const sidebarContent = document.getElementById("sidebar-content");
const clearButton = document.getElementById("clear-button");
const markButton = document.getElementById("mark-button");
const reviewButton = document.getElementById("review-button");
const attemptedCountSpan = document.getElementById("attempted-count");
const notAttemptedCountSpan = document.getElementById("not-attempted-count");
const skippedCountSpan = document.getElementById("skipped-count");
const reviewedCountSpan = document.getElementById("reviewed-count");
const markedCountSpan = document.getElementById("marked-count");

const resultContainer = document.getElementById("result-container");
const overallAnalysis = document.getElementById("overall-analysis");
const subjectWiseAnalysis = document.getElementById("subject-wise-analysis");

// Home screen(main) and popup info
// Typing text animation
document.addEventListener("DOMContentLoaded", function () {
  const jeeExamInfoElement = document.querySelector(".sub-text");
  const jeeExamInfoText =
    "To have a practice with Previous year questions is effecient way to score high in Examination. So, Practice with our Mock Test based on Previous Year's Question papers .";
  let jeeIndex = 0;
  function showJeeText() {
    jeeExamInfoElement.textContent += jeeExamInfoText[jeeIndex];
    jeeIndex++;
    if (jeeIndex < jeeExamInfoText.length) {
      setTimeout(showJeeText, 20);
    }
  }
  showJeeText();
});

// User Name validation
function validateInput() {
  var inputField = document.getElementById("userName");
  var inputValue = inputField.value;
  var filteredValue = inputValue.replace(/[^a-zA-Z]/g, "");
  // Update the input field with the filtered value
  inputField.value = filteredValue;
}

startBtn.onclick = () => {
  userName = document.getElementById("userName").value;
  if (userName.trim() !== "") {
    popupInfo.classList.add("active");
    main.classList.add("active");
    document.querySelector(
      ".popup-info h2"
    ).innerHTML = `<i class="fas fa-chalkboard-teacher"></i> Chapter-wise Test `;
  } else {
    alert("Please enter your name to start the test.");
  }
};

exitBtn.onclick = () => {
  popupInfo.classList.remove("active");
  main.classList.remove("active");
};

function showExamContainer() {
  var testContainer = document.getElementById("test-container");
  testContainer.style.display = "block";
  document.getElementById("body").style.background = "#f4f7f9";
  initializeTimer();
  popupInfo.classList.remove("active");
  main.classList.remove("active");
  main.style.display = "none";
  fullscreen();
  displayQuestion(currentQuestionIndex);

  // Set user name in header
  var userNameHeader = document.getElementById("userNameHeader");
  var userNameInput = document.getElementById("userName");
  userNameHeader.innerHTML =
    `<i class="fas fa-user"></i> ` + userNameInput.value;
}

// Fullscreen code starts
function fullscreen() {
  const elem = document.getElementById("test-container");

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}
// Fullscreen code ends

function displayQuestion(questionIndex) {
  // Stop timer for previous question
  if (questions[currentQuestionIndex].timeTaken === undefined) {
    questions[currentQuestionIndex].timeTaken = 0;
  }
  questions[currentQuestionIndex].timeTaken +=
    (Date.now() - questionStartTime) / 1000;

  // Start timer for the current question
  currentQuestionIndex = questionIndex;
  questionStartTime = Date.now();

  const question = questions[questionIndex];
  let statusText = "";
  if (question.isMarked) {
    statusText = "Marked";
  } else if (question.isReviewed) {
    statusText = "Reviewed";
  }

  let html = `
  <div class="question-container">
      <div class="question-info">
          <div class="question-text">
              <div class="question-header">
                  <span class="Quest-Num">${questionIndex + 1}</span>
                  <span class="question-status">${statusText}</span>
              </div>
              <div class="question-body">${question.text}</div>
          </div>
          ${
            question.image
              ? `<div class="question-image"><img src="${question.image}" alt="Question Image"></div>`
              : ""
          }
      </div>
      <div class="options-container">
`;

  if (
    (question.type === "SCQ" || question.type === "MCQ") &&
    !question.isReviewed
  ) {
    const optionLetters = ["A", "B", "C", "D"];
    question.options.forEach((option, index) => {
      const isSelected = question.userSelectedOption === index;
      const selectedClass = isSelected ? "selected" : "";
      html += `
          <div class="option-box ${selectedClass}" onclick="selectOption(${questionIndex}, ${index}, '${
        question.type
      }')">
              <span class="option-letter">${optionLetters[index]}</span>
              <div class="option-content">
                  ${option.text ? `<span>${option.text}</span>` : ""}
                  ${
                    option.image
                      ? `<img src="${option.image}" alt="Option Image">`
                      : ""
                  }
              </div>
          </div>`;
    });
  } else if (question.type === "Numerical") {
    html += `<input type="number" id="numerical-answer" value="${
      question.userSelectedOption || ""
    }" onchange="recordNumericalAnswer(${questionIndex}, this.value)" ${
      question.isReviewed ? "disabled" : ""
    }>`;
  } else if (question.type === "SCQ" || question.type === "MCQ") {
    html +=
      '<div class="message">Question is reviewed, options are disabled. Click on <span style="color: #f00">Clear</span> button to Enable options. </div>';
  }

  html += "</div></div>";

  questionDisplay.innerHTML = html;
  updateSidebar();
  updateAnalysis();
  MathJax.typeset();
}

function selectOption(questionIndex, optionIndex, type) {
  const question = questions[questionIndex];
  if (type === "SCQ") {
    question.userSelectedOption = optionIndex;
    question.isCorrect = optionIndex === question.correctOption;
  } else if (type === "MCQ") {
    const selectedIndex = question.userSelectedOption
      ? question.userSelectedOption.indexOf(optionIndex)
      : -1;
    if (selectedIndex > -1) {
      question.userSelectedOption.splice(selectedIndex, 1);
    } else {
      if (!question.userSelectedOption) {
        question.userSelectedOption = [];
      }
      question.userSelectedOption.push(optionIndex);
    }
    // Check if the selected options match the correct options exactly
    question.isCorrect =
      question.correctOption.every((opt) =>
        question.userSelectedOption.includes(opt)
      ) && question.userSelectedOption.length === question.correctOption.length;
  }
  question.attempted = true;
  displayQuestion(questionIndex);
}

function recordAnswer(questionIndex, value) {
  const question = questions[questionIndex];
  question.userSelectedOption = parseFloat(value);
  question.isCorrect = question.userSelectedOption === question.correctOption;
  question.attempted = true;
  updateSidebar();
}

function recordNumericalAnswer(questionIndex, answer) {
  const question = questions[questionIndex];
  const subject = question.subject;

  if (question.type === "Numerical") {
    if (numericalAttempts[subject] >= maxNumericalAttempts) {
      alert(
        `You have reached the limit of ${maxNumericalAttempts} numerical questions for ${subject}.`
      );
      return;
    } else {
      if (question.userSelectedOption === null) {
        numericalAttempts[subject]++;
      }
    }
  }

  question.userSelectedOption = parseInt(answer);
  question.attempted = true;
  question.notAttempted = false;
  displayQuestion(questionIndex);
}

function clearSelections() {
  const question = questions[currentQuestionIndex];
  question.userSelectedOption = null;
  question.attempted = false;
  if (question.isMarked) {
    markedCount--;
    question.isMarked = false;
  }
  if (question.isReviewed) {
    reviewedCount--;
    question.isReviewed = false;
  }
  displayQuestion(currentQuestionIndex);
}

function markQuestion() {
  const question = questions[currentQuestionIndex];
  if (
    (question.type === "SCQ" || question.type === "MCQ") &&
    question.userSelectedOption !== null
  ) {
    question.isMarked = true;
    markedCount++;
    updateSidebar();
    displayQuestion(currentQuestionIndex);
  } else if (
    question.type === "Numerical" &&
    question.userSelectedOption !== null
  ) {
    question.isMarked = true;
    markedCount++;
    updateSidebar();
    displayQuestion(currentQuestionIndex);
  }
}

function reviewQuestion() {
  const question = questions[currentQuestionIndex];
  if (question.userSelectedOption === null) {
    question.isReviewed = true;
    reviewedCount++;
    updateSidebar();
    displayQuestion(currentQuestionIndex);
  }
}

let currentSubject; // Default subject

function updateSidebar() {
  const tabsContainer = document.getElementById("subject-tabs-container");
  const sidebarContent = document.getElementById("question-boxes-container");
  tabsContainer.innerHTML = "";
  sidebarContent.innerHTML = "";
  currentSubject = questions[currentQuestionIndex].subject;

  const subjects = [...new Set(questions.map((q) => q.subject))];

  subjects.forEach((subject) => {
    let subjectTabClass = "subject-tab";
    if (subject === currentSubject) {
      subjectTabClass += " active";
    }

    tabsContainer.innerHTML += `<div class="${subjectTabClass}" onclick="toggleSubject('${subject}')">${subject}</div>`;
  });

  const subjectQuestions = questions.filter(
    (q) => q.subject === currentSubject
  );
  let questionsHtml = "";

  subjectQuestions.forEach((question, localIndex) => {
    const globalIndex = questions.indexOf(question);
    let classNames = "question-box";
    if (globalIndex === currentQuestionIndex) {
      classNames += " active";
    }
    if (question.isMarked) {
      classNames += " marked";
    } else if (question.isReviewed) {
      classNames += " reviewed";
    } else if (question.attempted) {
      classNames += " answered";
    } else if (question.timeTaken !== 0) {
      classNames += " skipped";
    } else {
      classNames += " not-visited";
    }
    questionsHtml += `<div class="${classNames}" onclick="jumpToQuestion(${globalIndex})">${
      globalIndex + 1
    }</div>`;
  });

  sidebarContent.innerHTML = `<div class="question-container active">${questionsHtml}</div>`;
}

function toggleSubject(subject) {
  currentSubject = subject;
  const subjectQuestions = questions.filter((q) => q.subject === subject);
  if (subjectQuestions.length > 0) {
    const firstQuestionIndex = questions.indexOf(subjectQuestions[0]);
    jumpToQuestion(firstQuestionIndex);
  }
  updateSidebar();
}

function jumpToQuestion(index) {
  currentQuestionIndex = index;
  displayQuestion(index);
}

function updateAnalysis() {
  let attempted = 0;
  let notAttempted = 0;
  let skipped = 0;
  let notVisited = 0;
  let reviewed = 0;
  let marked = 0;

  questions.forEach((question) => {
    if (question.attempted) {
      attempted++;
    } else {
      notAttempted++;
      if (question.timeTaken !== 0) {
        skipped++;
      } else {
        notVisited++;
      }
    }
    if (question.isReviewed) {
      reviewed++;
    }
    if (question.isMarked) {
      marked++;
    }
  });
  attemptedCountSpan.textContent = attempted - marked;
  notAttemptedCountSpan.textContent = notVisited;
  skippedCountSpan.textContent = skipped - reviewed;
  reviewedCountSpan.textContent = reviewed;
  markedCountSpan.textContent = marked;
}

function switchSubjectTab(subjectIndex) {
  currentSubjectIndex = subjectIndex;
  currentQuestionIndex = 0;
  displayQuestion(subjectIndex, currentQuestionIndex);
}

prevQuestionButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
  }
});

nextQuestionButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
});

function displayNextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
}

clearButton.addEventListener("click", clearSelections);
markButton.addEventListener("click", markQuestion);
reviewButton.addEventListener("click", reviewQuestion);

function toggleSidebar() {
  if (sidebar.style.right === "0px") {
    sidebar.style.right = "-300px";
  } else {
    sidebar.style.right = "0px";
  }
}

function initializeTimer() {
  const inputMinutes = questions.length * 2;
  const duration = inputMinutes * 60; // Convert minutes to seconds
  const display = document.getElementById("timer");
  startTimer(duration, display);
}

function startTimer(duration, display) {
  let timer = duration,
    hours,
    minutes,
    seconds;
  clearInterval(timerInterval);
  timerInterval = setInterval(function () {
    hours = parseInt(timer / 3600, 10);
    minutes = parseInt((timer % 3600) / 60, 10);
    seconds = parseInt(timer % 60, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = hours + ":" + minutes + ":" + seconds;

    if (--timer < 0) {
      display.textContent = "00:00:00";
      clearInterval(timerInterval);
      confirmSubmit();
    }
    elapsedMinutes = (duration - timer) / 60;
  }, 1000);
}

window.onload = function () {
  displayQuestion(currentQuestionIndex);
  updateSidebar();
  updateAnalysis();
};

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("questions-container");
  const testContainer = document.getElementById("test-container");
  const closeButton = document.getElementById("close-button");
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  const filterBox = document.createElement("div");
  filterBox.classList.add("filter-box-doc");

  // Define filter options
  const filterOptions = [
    "All",
    "Attempted",
    "Not Attempted",
    "Reviewed",
    "Marked",
  ];

  // Create filter select box
  const filterSelect = document.createElement("select");
  filterSelect.id = "filterSelect";
  filterSelect.addEventListener("change", applyFilter);

  // Populate filter options
  filterOptions.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.textContent = option;
    optionElement.value = option.toLowerCase().replace(" ", "-");
    filterSelect.appendChild(optionElement);
  });

  filterBox.appendChild(filterSelect);
  container.appendChild(filterBox);

  let questionNumber = 1;

  questions.forEach((questionObj, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    let questionTextHtml = questionObj.text || "";
    if (questionObj.image) {
      questionTextHtml += `<div class="question-image"><img src="${questionObj.image}" alt="Question Image"></div>`;
    }

    let optionsHtml = "";

    if (questionObj.type === "SCQ" || questionObj.type === "MCQ") {
      const optionLetters = ["A", "B", "C", "D"];
      optionsHtml = `
        <ul class="options">
          ${questionObj.options
            .map((option, optionIndex) => {
              let optionContent = option.text || "";
              if (option.image) {
                optionContent += `<img src="${option.image}" alt="Option Image">`;
              }
              const isSelected = questionObj.userSelectedOption === optionIndex;
              const selectedClass = isSelected ? "selected" : "";
              const disabled = questionObj.attempted ? "disabled" : "";
              return `<li class="option-box ${selectedClass} ${disabled}" onclick="selectOption(${index}, ${optionIndex}, '${questionObj.type}')">
                      <span class="option-letter">${optionLetters[optionIndex]}</span>
                      <div class="option-content">${optionContent}</div>
                    </li>`;
            })
            .join("")}
        </ul>
      `;
    } else if (questionObj.type === "Numerical") {
      optionsHtml = `
        <div class="numerical-answer">
          <label for="numerical-answer-${questionNumber}">Answer:</label>
          <input type="number" id="numerical-answer-${questionNumber}" value="${
        questionObj.userSelectedOption || ""
      }" onchange="recordNumericalAnswer(${index}, this.value)" ${
        questionObj.attempted ? "disabled" : ""
      } />
        </div>
      `;
    }

    questionDiv.innerHTML = `
      <h2>${questionNumber}. ${questionTextHtml} <span class="expand-icon" onclick="expandQuestion(${index})">▶</span></h2>
      ${optionsHtml}
    `;

    container.appendChild(questionDiv);
    questionNumber++;
  });

  container.addEventListener("scroll", () => {
    if (container.scrollTop > 100) {
      // Show button after scrolling down 100px
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });

  function scrollToTop() {
    container.scrollTop = 0;
  }

  function applyFilter() {
    const selectedOption = filterSelect.value;
    questions.forEach((question, index) => {
      const questionDiv = container.children[index + 1]; // +1 because first child is filterBox
      if (selectedOption === "all") {
        questionDiv.style.display = "block";
      } else {
        let displayQuestion = false;
        switch (selectedOption) {
          case "attempted":
            displayQuestion = question.attempted;
            break;
          case "not-attempted":
            displayQuestion = !question.attempted;
            break;
          case "reviewed":
            displayQuestion = question.isReviewed;
            break;
          case "marked":
            displayQuestion = question.isMarked;
            break;
        }
        questionDiv.style.display = displayQuestion ? "block" : "none";
      }
    });
  }
});

function expandQuestion(questionIndex) {
  document.getElementById("questions-container").style.display = "none";
  document.getElementById("test-container").style.display = "block";
  document.getElementById("close-button").style.display = "none";
  fullscreen();
  displayQuestion(questionIndex);
}
function toggleQuestions() {
  const container = document.getElementById("questions-container");
  const testContainer = document.getElementById("test-container");
  container.style.display = "block";
  testContainer.style.display = "none";
  document.getElementById("close-button").style.display = "block";
  fullscreen();
}

function closeDoc() {
  document.getElementById("questions-container").style.display = "none";
  document.getElementById("test-container").style.display = "block";
  document.getElementById("close-button").style.display = "none";
  fullscreen();
}

function confirmSubmit() {
  document.getElementById("confirmationModal").style.display = "none";
  document.getElementById("test-container").style.display = "none";
  document.getElementById("result-container").style.display = "block";
  document.getElementById("body").style.background = "white";
  clearInterval(timerInterval);
  showPerformanceAnalysis();
  submitButton();
}

document.getElementById("cancelSubmit").addEventListener("click", () => {
  document.getElementById("confirmationModal").style.display = "none";
  fullscreen();
});

function submitTest() {
  document.getElementById("confirmationModal").style.display = "block";
  toggleSidebar();
  updateAnalysis();
  fullscreen();
}

function showPerformanceAnalysis() {
  const overallAnalysis = document.getElementById("overallAnalysis");
  const subjectWiseAnalysis = document.getElementById("subjectWiseAnalysis");

  const totalQuestions = questions.length;
  const attemptedQuestions = questions.filter((q) => q.attempted).length;
  const notAttemptedQuestions = totalQuestions - attemptedQuestions;

  let correctQuestions = [];
  let incorrectQuestions = [];
  let notAttemptedQuestionsIndices = [];
  let markedQuestions = [];
  let reviewedQuestions = [];
  let skippedQuestions = [];

  let totalMarks = 0;
  let overallTimeSpent = 0;

  questions.forEach((question, index) => {
    overallTimeSpent += question.timeTaken;

    if (question.attempted) {
      let isCorrect = false;
      if (question.type === "SCQ") {
        isCorrect = question.userSelectedOption === question.correctAnswer;
      } else if (question.type === "MCQ") {
        isCorrect =
          question.correctAnswer.every((opt) =>
            question.userSelectedOption.includes(opt)
          ) &&
          question.correctAnswer.length === question.userSelectedOption.length;
      } else if (question.type === "Numerical") {
        isCorrect = question.userSelectedOption === question.correctAnswer;
      }

      if (isCorrect) {
        correctQuestions.push(index + 1);
        totalMarks += 4;
      } else {
        incorrectQuestions.push(index + 1);
        totalMarks -= question.type === "MCQ" ? 2 : 1;
      }
    } else {
      notAttemptedQuestionsIndices.push(index + 1);
      if (question.timeTaken !== 0) {
        skippedQuestions.push(index + 1);
      }
    }

    if (question.isMarked) markedQuestions.push(index + 1);
    if (question.isReviewed) reviewedQuestions.push(index + 1);
  });

  const { rank, percentile } = calculateRankAndPercentile(totalMarks);
  const percentage = (totalMarks / (questions.length * 4)) * 100;
  const inputMinutes = questions.length * 2;

  overallAnalysis.innerHTML = `
        <div class="analysis-container2">

            <!-- Rank, Percentile, Total Marks, Total Time Taken, Accuracy -->
          <div class="info-container">
            <div class="info-item rank">
              <div class="info-text">
                <i class="fas fa-trophy"></i>
                <span>Expected Rank: <span id="rank-value">${rank}</span></span>
              </div>
            </div>
            <div class="info-item percentile">
              <div class="info-text">
                <i class="fas fa-chart-line"></i>
                <span>Expected Percentile: <span id="percentile-value">${percentile}%</span></span>
              </div>
              <svg viewBox="0 0 36 36" class="circular-chart5">
                <path
                  class="circle-bg5"
                  d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  id="circle5"
                  class="circle5"
                  d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
            <div class="info-item total-marks">
              <div class="info-text">
                <i class="fas fa-star"></i>
                <span
                  >Total Marks: <span id="total-marks">${totalMarks}</span></span
                >
              </div>
              <svg viewBox="0 0 36 36" class="circular-chart5">
                <path
                  class="circle-bg5"
                  d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  id="circle5"
                  class="circle5"
                  d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
            <div class="info-item total-time">
              <div class="info-text">
                <i class="fas fa-clock"></i>
                <span
                  >Total Time Taken: <span id="total-time-spent2">${elapsedMinutes.toFixed(
                    2
                  )}</span> (in min)</span
                >
              </div>
              <svg viewBox="0 0 36 36" class="circular-chart5">
                <path
                  class="circle-bg5"
                  d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  id="circle5"
                  class="circle5"
                  d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
            <div class="info-item accuracy">
              <div class="info-text">
                <i class="fas fa-bullseye"></i>
                <span>Accuracy: <span id="accuracy-value">${Math.floor(
                  (correctQuestions.length /
                    (correctQuestions.length + incorrectQuestions.length)) *
                    100
                )}%</span></span>
              </div>
              <svg viewBox="0 0 36 36" class="circular-chart5">
                <path
                  class="circle-bg5"
                  d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  id="circle5"
                  class="circle5"
                  d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>


<!-- Bar Graph -->
          <div id="overallAnalysisBarChart" class="chart-container"></div>

          <div id="chartContainer">
<h2>Time Spent per Question</h2>
<div id="timeAnalysisChart" class="chart-container"></div>
<div id="pagination">
<button id="prevBtn" class="disabled"><i class="fas fa-arrow-left"></i></button>
<span id="pageNumbers"></span>
<button id="nextBtn"><i class="fas fa-arrow-right"></i></button>
</div>
</div>


 <div id="filterContainer">
<h2>Filtering Questions By Condition</h2>
<div id="filter-container">
<div id="filter-button">Filter Options</div>
<div class="dropdown-content">
<label><input type="checkbox" value="correct" checked /> Correct</label>
<label><input type="checkbox" value="incorrect" /> Incorrect</label>
<label><input type="checkbox" value="notAttempted" /> Not Answered</label>
<label><input type="checkbox" value="marked" /> Marked</label>
<label><input type="checkbox" value="reviewed" /> Reviewed</label>
<label><input type="checkbox" value="timeBased" /> Time Based</label>
<label><input type="checkbox" value="skipped" /> Skipped</label>
<label><input type="checkbox" value="notVisited" /> Not Visited</label>
</div>
</div>
<div class="analysis-item2">
<div class="analysis-header2">
<span><i class="fas fa-hourglass-half" style="color: #514caf; margin-right: 10px"></i> Filter:</span>
<span style="color: #514caf">
  <button class="toggle-btn" onclick="toggleContent(this)">
    <i class="fas fa-chevron-down"></i>
  </button>
</span>
</div>
<div class="selected-filters" id="selected-filters"></div>
<div id="question-box-container" class="analysis-content2"></div>
</div>
</div>

<div class="graph">
<h3>Subjects Comparison</h3>
<div id="subjectWiseChart" class="chart-container"></div>
</div>

</div>
        `;

  document.getElementById("user-name").innerText = userName.toUpperCase();
  // Update progress bars
  const accuracy =
    (correctQuestions.length /
      (correctQuestions.length + incorrectQuestions.length)) *
    100;
  document.querySelector(
    ".percentile .circle5"
  ).style.strokeDasharray = `${percentile}, 100`;
  document.querySelector(".total-marks .circle5").style.strokeDasharray = `${
    (totalMarks * 100) / (questions.length * 4)
  }, 100`;
  document.querySelector(
    ".total-time .circle5"
  ).style.strokeDasharray = `${Math.floor(
    (elapsedMinutes / inputMinutes) * 100
  )}, 100`; // Assuming 240 mins as the maximum time
  document.querySelector(
    ".accuracy .circle5"
  ).style.strokeDasharray = `${Math.floor(accuracy)}, 100`;

  const filterContainer = document.getElementById("filter-container");
  const questionBoxContainer = document.getElementById(
    "question-box-container"
  );
  const selectedFiltersContainer = document.getElementById("selected-filters");

  filterContainer.addEventListener("change", updateQuestionBoxes);

  function updateQuestionBoxes() {
    const filters = Array.from(
      filterContainer.querySelectorAll("input:checked")
    ).map((checkbox) => checkbox.value);

    questionBoxContainer.innerHTML = "";
    selectedFiltersContainer.innerHTML = `Showing: ${filters.join(", ")}`;

    const allQuestions = questions.map((q, index) => ({
      index: index + 1,
      isCorrect:
        (q.type === "SCQ" && q.userSelectedOption === q.correctAnswer) ||
        (q.type === "MCQ" &&
          q.correctAnswer.every((opt) => q.userSelectedOption.includes(opt)) &&
          q.correctAnswer.length === q.userSelectedOption.length) ||
        (q.type === "Numerical" && q.userSelectedOption === q.correctAnswer),
      isIncorrect:
        q.attempted &&
        !(
          (q.type === "SCQ" && q.userSelectedOption === q.correctAnswer) ||
          (q.type === "MCQ" &&
            q.correctAnswer.every((opt) =>
              q.userSelectedOption.includes(opt)
            ) &&
            q.correctAnswer.length === q.userSelectedOption.length) ||
          (q.type === "Numerical" && q.userSelectedOption === q.correctAnswer)
        ),
      isNotAttempted: !q.attempted,
      isMarked: q.isMarked,
      isReviewed: q.isReviewed,
      isTimeBased: q.timeTaken > 0,
      isSkipped: !q.attempted && q.timeTaken !== 0,
      isVisited: !q.attempted && q.timeTaken === 0,
    }));

    const filteredQuestions = allQuestions.filter((q) =>
      filters.every((filter) => {
        if (filter === "correct") return q.isCorrect;
        if (filter === "incorrect") return q.isIncorrect;
        if (filter === "notAttempted") return q.isNotAttempted;
        if (filter === "marked") return q.isMarked;
        if (filter === "reviewed") return q.isReviewed;
        if (filter === "timeBased") return q.isTimeBased;
        if (filter === "skipped") return q.isSkipped;
        if (filter === "notVisited") return q.isVisited;
        return true;
      })
    );

    questionBoxContainer.innerHTML = filteredQuestions
      .map((q) => `<div class="circular-box2 filter-box">${q.index}</div>`)
      .join("");
    // Add click event listeners to question boxes
    const questionBoxes = document.querySelectorAll(".circular-box2");
    questionBoxes.forEach((box) => {
      box.addEventListener("click", () => {
        const questionNumber = parseInt(box.textContent, 10);
        document.getElementById("result-container").style.display = "none";
        document.getElementById("question-container2").style.display = "block";
        currentQuestionIndex2 = questionNumber - 1;
        displayQuestion2(currentQuestionIndex2); // Adjust for zero-based index
      });
    });
  }

  updateQuestionBoxes();

  let currentIndex = 0;
  const itemsPerPage = 10;

  function renderChart() {
    const start = currentIndex * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedQuestions = questions.slice(start, end);

    const timeData = paginatedQuestions.map((question) =>
      Math.floor(question.timeTaken || 0)
    );
    const categories = paginatedQuestions.map(
      (_, index) => `Q${start + index + 1}`
    );

    const optionsTimeAnalysis = {
      chart: {
        type: "area",
        height: 350,
        toolbar: {
          show: true,
        },
      },
      series: [
        {
          name: "Time Spent",
          data: timeData, // Sample data
        },
      ],
      xaxis: {
        categories: categories,
        title: {
          text: "Question Numbers",
        },
      },
      yaxis: {
        title: {
          text: "Time (seconds)",
        },
        min: 0, // Ensure the y-axis starts at 0
      },
      stroke: {
        curve: "smooth", // Make the line smooth
        width: 2,
      },
      markers: {
        size: 5, // Show markers on data points
        colors: ["#FFA41B"],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        x: {
          show: true,
        },
        y: {
          title: {
            formatter: (seriesName) => `${seriesName}:`,
          },
        },
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // alternating row colors
          opacity: 0.5,
        },
      },
      theme: {
        mode: "light", // Switch between 'dark' and 'light' themes
        palette: "palette1", // Predefined palette (1-10)
        monochrome: {
          enabled: false,
          color: "#255aee",
          shadeTo: "light",
          shadeIntensity: 0.65,
        },
      },
    };

    document.querySelector("#timeAnalysisChart").innerHTML = "";
    const timeChart = new ApexCharts(
      document.querySelector("#timeAnalysisChart"),
      optionsTimeAnalysis
    );
    timeChart.render();
  }

  function renderPagination() {
    const totalPages = Math.ceil(questions.length / itemsPerPage);
    const pageNumbersContainer = document.getElementById("pageNumbers");
    pageNumbersContainer.innerHTML = "";

    for (let i = 0; i < totalPages; i++) {
      const start = i * itemsPerPage + 1;
      const end = Math.min((i + 1) * itemsPerPage, questions.length);
      const button = document.createElement("button");
      button.innerText = `${start}`;
      button.className = i === currentIndex ? "active" : "";
      button.addEventListener("click", () => {
        currentIndex = i;
        renderChart();
        renderPagination();
      });
      pageNumbersContainer.appendChild(button);
    }

    document.getElementById("prevBtn").className =
      currentIndex === 0 ? "disabled" : "";
    document.getElementById("nextBtn").className =
      (currentIndex + 1) * itemsPerPage >= questions.length ? "disabled" : "";
  }

  document.getElementById("nextBtn").addEventListener("click", () => {
    if ((currentIndex + 1) * itemsPerPage < questions.length) {
      currentIndex++;
      renderChart();
      renderPagination();
    }
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderChart();
      renderPagination();
    }
  });

  // Initial render
  renderChart();
  renderPagination();

  const notVisitedCount = questions.length - skippedQuestions.length;

  // Overall Analysis Bar Chart
  var optionsOverallAnalysis = {
    chart: {
      type: "bar",
      height: 350,
    },
    series: [
      {
        name: "Marks",
        data: [
          correctQuestions.length,
          incorrectQuestions.length,
          notAttemptedQuestions,
          skippedQuestions.length,
          markedQuestions.length,
          reviewedQuestions.length,
          notVisitedCount,
        ], // Sample data
      },
    ],
    colors: [
      "#00cd00",
      "#f44336",
      "#5f5f5f",
      "#f5b74f",
      "#ff9800",
      "#2196f3",
      "#0ba6a6",
    ],
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        horizontal: false,
        columnWidth: "60%",
      },
    },
    xaxis: {
      categories: [
        "Correct",
        "Incorrect",
        "Not Answered",
        "Skipped",
        "Marked",
        "Reviewed",
        "Not Visited",
      ],
      title: {
        text: "Category",
      },
    },
    yaxis: {
      title: {
        text: "Number of questions per Category",
      },
    },
  };

  var overallChart = new ApexCharts(
    document.querySelector("#overallAnalysisBarChart"),
    optionsOverallAnalysis
  );
  overallChart.render();

  // subject wise comparative graph starts
  const uniqueSubjects = [...new Set(questions.map((q) => q.subject))]; // Extract unique subjects

  const subjectMetrics = uniqueSubjects.map((subject) => {
    const subjectQuestions = questions.filter((q) => q.subject === subject);
    const subjectAttemptedQuestions = subjectQuestions.filter(
      (q) => q.attempted
    ).length;
    const subjectNotAttemptedQuestions = subjectQuestions.filter(
      (q) => !q.attempted
    ).length;
    let subjectCorrectQuestions = 0;
    let subjectIncorrectQuestions = 0;
    let subjectMarkedQuestions = 0;
    let subjectReviewedQuestions = 0;
    let subjectMarks = 0;
    let subjectTimeSpent = 0;

    subjectQuestions.forEach((question) => {
      subjectTimeSpent += question.timeTaken || 0;
      if (question.attempted) {
        let isCorrect = false;
        if (question.type === "SCQ") {
          isCorrect = question.userSelectedOption === question.correctAnswer;
        } else if (question.type === "MCQ") {
          isCorrect =
            question.correctAnswer.every((opt) =>
              question.userSelectedOption.includes(opt)
            ) &&
            question.correctAnswer.length ===
              question.userSelectedOption.length;
        } else if (question.type === "Numerical") {
          isCorrect = question.userSelectedOption === question.correctAnswer;
        }

        if (isCorrect) {
          subjectCorrectQuestions++;
          subjectMarks += 4;
        } else {
          subjectIncorrectQuestions++;
          subjectMarks -= question.type === "MCQ" ? 2 : 1;
        }
      }
      if (question.isMarked) subjectMarkedQuestions++;
      if (question.isReviewed) subjectReviewedQuestions++;
    });

    return {
      subject,
      subjectAttemptedQuestions,
      subjectNotAttemptedQuestions,
      subjectCorrectQuestions,
      subjectIncorrectQuestions,
      subjectMarkedQuestions,
      subjectReviewedQuestions,
      subjectTimeSpent,
    };
  });

  const options = {
    chart: {
      type: "bar",
      height: 450,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: "top",
        },
        grouped: true,
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
    },
    series: [
      {
        name: "Attempted Questions",
        data: subjectMetrics.map((data) => data.subjectAttemptedQuestions),
      },
      {
        name: "Not Attempted Questions",
        data: subjectMetrics.map((data) => data.subjectNotAttemptedQuestions),
      },
      {
        name: "Correct Questions",
        data: subjectMetrics.map((data) => data.subjectCorrectQuestions),
      },
      {
        name: "Incorrect Questions",
        data: subjectMetrics.map((data) => data.subjectIncorrectQuestions),
      },
      {
        name: "Marked Questions",
        data: subjectMetrics.map((data) => data.subjectMarkedQuestions),
      },
      {
        name: "Reviewed Questions",
        data: subjectMetrics.map((data) => data.subjectReviewedQuestions),
      },
    ],
    xaxis: {
      categories: subjectMetrics.map((data) => data.subject),
      title: {
        text: "Subjects",
      },
    },
    yaxis: {
      title: {
        text: "Count / Time (seconds)",
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  const subjectWiseChart = new ApexCharts(
    document.querySelector("#subjectWiseChart"),
    options
  );
  subjectWiseChart.render();

  let subjectWiseHtml = "";
  const subjects = [...new Set(questions.map((q) => q.subject))]; // Extract unique subjects

  subjects.forEach((subject) => {
    const subjectQuestions = questions.filter((q) => q.subject === subject);
    const subjectAttemptedQuestions = subjectQuestions.filter(
      (q) => q.attempted
    ).length;
    const subjectNotAttemptedQuestions = subjectQuestions.filter(
      (q) => !q.attempted
    ).length;
    let subjectCorrectQuestions = [];
    let subjectIncorrectQuestions = [];
    let subjectMarkedQuestions = [];
    let subjectReviewedQuestions = [];

    let subjectMarks = 0;
    let subjectTimeSpent = 0;

    subjectQuestions.forEach((question, index) => {
      const globalIndex = questions.indexOf(question);
      subjectTimeSpent += question.timeTaken || 0;
      if (question.attempted) {
        let isCorrect = false;
        if (question.type === "SCQ") {
          isCorrect = question.userSelectedOption === question.correctAnswer;
        } else if (question.type === "MCQ") {
          isCorrect =
            question.correctAnswer.every((opt) =>
              question.userSelectedOption.includes(opt)
            ) &&
            question.correctAnswer.length ===
              question.userSelectedOption.length;
        } else if (question.type === "Numerical") {
          isCorrect = question.userSelectedOption === question.correctAnswer;
        }

        if (isCorrect) {
          subjectCorrectQuestions.push(globalIndex + 1); // Start indices from 1
          subjectMarks += 4;
        } else {
          subjectIncorrectQuestions.push(globalIndex + 1); // Start indices from 1
          subjectMarks -= question.type === "MCQ" ? 2 : 1;
        }
      }
      if (question.isMarked) subjectMarkedQuestions.push(globalIndex + 1); // Start indices from 1
      if (question.isReviewed) subjectReviewedQuestions.push(globalIndex + 1); // Start indices from 1
    });
    subjectQuestions.length;

    subjectWiseHtml += `
            <div class="subject-container">
            <div class="subject-header">
              <h3>${subject}</h3>
            </div>

            <!-- Details: Marks, Total Time, Accuracy -->
            <div class="subject-details">
              <div class="info-container">
              <!-- Marks -->
              <div class="info-item total-marks">
                <div class="info-text">
                <i class="fas fa-star"></i>
                <span
                  >Total Marks: <span id="total-marks-value">${subjectMarks}</span></span
                >
              </div>
                <svg viewBox="0 0 36 36" class="circular-chart5">
                  <path
                    class="circle-bg5"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    id="circle5Physics"
                    class="circle5 green"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    style="stroke-dasharray: ${
                      (subjectMarks * 100) / (subjectQuestions.length * 4)
                    }, 100;"
                  />
                </svg>
              </div>

              <!-- Total Time -->
              <div class="info-item total-time">
                <div class="info-text">
                <i class="fas fa-clock"></i>
                <span
                  >Total Time Taken: <span id="total-time-value">${(
                    subjectTimeSpent / 60
                  ).toFixed(2)}</span> (in min)</span
                >
              </div>
                <svg viewBox="0 0 36 36" class="circular-chart5">
                  <path
                    class="circle-bg5"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    id="circle5Physics"
                    class="circle5 red"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    style="stroke-dasharray: ${Math.floor(
                      (subjectTimeSpent / 60 / (subjectQuestions.length * 2)) *
                        100
                    )}, 100;"
                  />
                </svg>
              </div>

              <!-- Accuracy -->
              <div class="info-item accuracy">
                <div class="info-text">
                <i class="fas fa-bullseye"></i>
                <span>Accuracy: <span id="accuracy-value">${Math.floor(
                  (subjectCorrectQuestions.length /
                    (subjectCorrectQuestions.length +
                      subjectIncorrectQuestions.length)) *
                    100
                )}%</span></span>
              </div>
                <svg viewBox="0 0 36 36" class="circular-chart5">
                  <path
                    class="circle-bg5"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    id="circle5Physics"
                    class="circle5 orange"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    style="stroke-dasharray: ${
                      (subjectCorrectQuestions.length /
                        (subjectCorrectQuestions.length +
                          subjectIncorrectQuestions.length)) *
                      100
                    }, 100;"
                  />
                </svg>
              </div>
              </div>
            </div>
                <div class="analysis-item2" style="border-left: 3px solid #00cd00" >
                    <div class="analysis-header2">
                        <span><i class="fas fa-check-circle" style="color: #00cd00; margin-right:10px"></i>Correct Questions:</span>
                        <span style="color:#4caf50">${
                          subjectCorrectQuestions.length
                        }(${
      subjectCorrectQuestions.length * 4
    })<button class="toggle-btn" onclick="toggleContent(this)">
        <i class="fas fa-chevron-down"></i>
      </button></span>
                    </div>
                    <progress
                 max="${
                   subjectAttemptedQuestions + subjectNotAttemptedQuestions
                 }"
                 style="border: none; height: 5px; width: 100%;"
                 value="${subjectCorrectQuestions.length}"
                 ></progress>
                    <div class="analysis-content2">
                        ${subjectCorrectQuestions
                          .map(
                            (q) =>
                              `<div class="circular-box2 correct2">${q}</div>`
                          )
                          .join("")}
                    </div>
                </div>
                <div class="analysis-item2" style="border-left: 3px solid #f44336">
                    <div class="analysis-header2">
                        <span><i class="fas fa-times-circle" style="color: #f44336; margin-right:10px"></i>Incorrect Questions:</span>
                        <span style="color:#f44336">${
                          subjectIncorrectQuestions.length
                        } (${
      subjectIncorrectQuestions.length * -1
    })<button class="toggle-btn" onclick="toggleContent(this)">
        <i class="fas fa-chevron-down"></i>
      </button></span>
                    </div>
                    <progress
                 max="${
                   subjectAttemptedQuestions + subjectNotAttemptedQuestions
                 }"
                 style="border: none; height: 5px; width: 100%;"
                 value="${subjectIncorrectQuestions.length}"
                 ></progress>
                    <div class="analysis-content2">
                        ${subjectIncorrectQuestions
                          .map(
                            (q) =>
                              `<div class="circular-box2 incorrect2">${q}</div>`
                          )
                          .join("")}
                    </div>
                </div>
                <div class="analysis-item2" style="border-left: 3px solid #ff9800">
                    <div class="analysis-header2">
                        <span><i class="fas fa-save" style="color: #ff9800; margin-right:10px"></i>Marked Questions:</span>
                        <span style="color:#ff9800">${
                          subjectMarkedQuestions.length
                        }        <button class="toggle-btn" onclick="toggleContent(this)">
        <i class="fas fa-chevron-down"></i>
      </button></span>
                    </div>
                    <progress
                 max="${
                   subjectAttemptedQuestions + subjectNotAttemptedQuestions
                 }"
                 style="border: none; height: 5px; width: 100%;"
                 value="${subjectMarkedQuestions.length}"
                 ></progress>
                    <div class="analysis-content2">
                        ${subjectMarkedQuestions
                          .map(
                            (q) =>
                              `<div class="circular-box2 marked2">${q}</div>`
                          )
                          .join("")}
                    </div>
                </div>
                <div class="analysis-item2" style="border-left: 3px solid #2196f3">
                    <div class="analysis-header2">
                        <span><i class="fas fa-flag" style="color: #2196f3; margin-right:10px"></i>Reviewed Questions:</span>
                        <span style="color:#2196f3">${
                          subjectReviewedQuestions.length
                        }      <button class="toggle-btn" onclick="toggleContent(this)">
        <i class="fas fa-chevron-down"></i>
      </button></span>
                    </div>
                    <progress
                 max="${
                   subjectAttemptedQuestions + subjectNotAttemptedQuestions
                 }"
                 style="border: none; height: 5px; width: 100%;"
                 value="${subjectReviewedQuestions.length}"
                 ></progress>
                    <div class="analysis-content2">
                        ${subjectReviewedQuestions
                          .map(
                            (q) =>
                              `<div class="circular-box2 reviewed2">${q}</div>`
                          )
                          .join("")}
                    </div>
                </div>
</div>
            `;

    subjectWiseAnalysis.innerHTML = subjectWiseHtml;

    // Add click event listeners to question boxes
    const questionBoxes = document.querySelectorAll(".circular-box2");
    questionBoxes.forEach((box) => {
      box.addEventListener("click", () => {
        const questionNumber = parseInt(box.textContent, 10);
        document.getElementById("result-container").style.display = "none";
        document.getElementById("question-container2").style.display = "block";
        currentQuestionIndex2 = questionNumber - 1;
        displayQuestion2(currentQuestionIndex2); // Adjust for zero-based index
      });
    });
  });
}

// SIDEBAR TOGGLE

const sidebarD = document.getElementById("sidebarD");

function dashboardSidebar() {
  if (sidebarD.style.left === "0px") {
    sidebarD.style.left = "-300px";
    sidebarD.classList.remove("sidebar-responsive");
  } else {
    sidebarD.style.left = "0px";
    sidebarD.classList.add("sidebar-responsive");
  }
}

//   Feedback form Code Starts
document
  .getElementById("feedbackForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const questionNumber = document.getElementById("questionNumber").value;
    const issueType = document.getElementById("issueType").value;
    const questionFeedback = document.getElementById("questionFeedback").value;
    const solutionFeedback = document.getElementById("solutionFeedback").value;
    const examConductionFeedback = document.getElementById(
      "examConductionFeedback"
    ).value;
    const otherFeedback = document.getElementById("otherFeedback").value;

    const url = new URL(
      "https://script.google.com/macros/s/AKfycbzW4SkS3YCk75p23ofWSiDjcnjzafx2azknpEbTvCWwr1CMWnW586YzmChM3sjq1YPejQ/exec"
    );
    url.searchParams.append("email", email);
    url.searchParams.append("questionNumber", questionNumber);
    url.searchParams.append("issueType", issueType);
    url.searchParams.append("questionFeedback", questionFeedback);
    url.searchParams.append("solutionFeedback", solutionFeedback);
    url.searchParams.append("examConductionFeedback", examConductionFeedback);
    url.searchParams.append("otherFeedback", otherFeedback);

    const messageDiv = document.getElementById("message");
    messageDiv.innerText = "Submitting response...";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.result === "success") {
          messageDiv.innerText = "Feedback submitted successfully.";
          document.getElementById("feedbackForm").reset();
        } else {
          messageDiv.innerText = "Error submitting feedback.";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        messageDiv.innerText = "Error submitting feedback.";
      });
  });

// Feedback form code ends

document.getElementById("overviewBtn").addEventListener("click", function () {
  document.getElementById("overallAnalysis").style.display = "block";
  document.getElementById("subjectWiseAnalysis").style.display = "none";
  document.getElementById("feedback").style.display = "none";
});
document.getElementById("subjectsBtn").addEventListener("click", function () {
  document.getElementById("overallAnalysis").style.display = "none";
  document.getElementById("subjectWiseAnalysis").style.display = "block";
  document.getElementById("feedback").style.display = "none";
});
document.getElementById("feedbackBtn").addEventListener("click", function () {
  document.getElementById("overallAnalysis").style.display = "none";
  document.getElementById("subjectWiseAnalysis").style.display = "none";
  document.getElementById("feedback").style.display = "block";
});
async function submitButton() {
  const userName = document.getElementById("user-name").textContent.trim();
  const testDateTime = new Date().toLocaleString();
  const totalMarks = parseFloat(
    document.getElementById("total-marks").textContent.trim()
  );
  const totalTimeTaken = parseFloat(
    document.getElementById("total-time-spent2").textContent.trim()
  );
  const { rank, percentile } = calculateRankAndPercentile(totalMarks);
  const testName = "JEE Mains(24 Jan 2023- Morning)";

  for (let index = 0; index < questions.length; index++) {
    const question = questions[index];
    const questionData = {
      testName: testName,
      userName: userName,
      testDateTime: testDateTime,
      questionNumber: index + 1,
      correctAnswer: JSON.stringify(question.correctAnswer),
      userSelectedOption: JSON.stringify(question.userSelectedOption),
      timeTaken: question.timeTaken ? question.timeTaken.toFixed(2) : 0,
      isMarked: question.isMarked ? "True" : "False",
      isReviewed: question.isReviewed ? "True" : "False",
      attempted: question.attempted ? "True" : "False",
      notAttempted: question.attempted ? "False" : "True",
      totalMarks: totalMarks,
      percentile: percentile,
      rank: rank,
      totalTimeTaken: totalTimeTaken,
    };

    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(questionData)) {
      formData.append(key, value);
    }

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzS78tkWZtpGAohkYo72RdKXEqFeVigUV4pa1WvUecCIZWoXbFUIgUQTwQOF6bCaLHc/exec",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        console.log(`Data for question ${index + 1} submitted successfully!`);
      } else {
        console.log(`Data submission for question ${index + 1} failed.`);
      }
    } catch (error) {
      console.error(`Error for question ${index + 1}:`, error);
    }
  }
}

function calculateMarks(question) {
  let marks = 0;
  if (question.attempted) {
    if (question.type === "SCQ" || question.type === "Numerical") {
      if (question.userSelectedOption === question.correctAnswer) {
        marks = 4;
      } else {
        marks = -1;
      }
    } else if (question.type === "MCQ") {
      let correctCount = 0;
      question.userSelectedOption.forEach((optionIndex) => {
        if (question.correctAnswer.includes(optionIndex)) {
          correctCount++;
        } else {
          correctCount--;
        }
      });
      if (correctCount === question.correctAnswer.length) {
        marks = 4;
      } else {
        marks = -2;
      }
    }
  }
  return marks;
}

function toggleContent(button) {
  const analysisItem = button.closest(".analysis-item2");
  const content = analysisItem.querySelector(".analysis-content2");

  if (content.style.display === "none" || content.style.display === "") {
    content.style.display = "flex";
    button.classList.add("active");
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
  } else {
    content.style.display = "none";
    button.classList.remove("active");
    button.innerHTML = '<i class="fas fa-chevron-down"></i>';
  }
}

function calculateRankAndPercentile(totalMarks) {
  for (const range of data) {
    if (totalMarks >= range.marks[0] && totalMarks <= range.marks[1]) {
      const marksRange = range.marks[1] - range.marks[0];
      const relativePosition = (totalMarks - range.marks[0]) / marksRange;
      const rank =
        range.rank[0] +
        Math.round(relativePosition * (range.rank[1] - range.rank[0]));
      const percentile =
        range.percentile[0] +
        relativePosition * (range.percentile[1] - range.percentile[0]);
      return { rank, percentile: percentile.toFixed(5) };
    }
  }
  return { rank: "Not Found", percentile: "Not Found" };
}

function displayQuestionsBySubject(subject) {
  const filteredQuestions = questions.filter((q) => q.subject === subject);

  const questionListHtml = filteredQuestions
    .map(
      (q, index) =>
        `
            <div class="question-item" data-question-index="${index}">
              <h4>Question ${index + 1}</h4>
              <p>${q.question}</p>
            </div>
          `
    )
    .join("");

  const displayQuestionContainer = document.getElementById("displayQuestion2");
  displayQuestionContainer.innerHTML = questionListHtml;

  // Scroll to the displayQuestion2 section
  displayQuestionContainer.scrollIntoView({ behavior: "smooth" });
}

function displayQuestionByIndex(index) {
  const question = questions[index - 1]; // Adjust index to be zero-based

  const questionHtml = `
          <div class="question-item">
            <h4>Question ${index}</h4>
            <p>${question.question}</p>
          </div>
        `;

  const displayQuestionContainer = document.getElementById("displayQuestion2");
  displayQuestionContainer.innerHTML = questionHtml;

  // Scroll to the displayQuestion2 section
  displayQuestionContainer.scrollIntoView({ behavior: "smooth" });
}

// Function to open the sidebar
function openSidebar() {
  document.getElementById("sidebar2").classList.add("open");
}

// Function to close the sidebar
function closeSidebar() {
  document.getElementById("sidebar2").classList.remove("open");
}

function jumpToQuestion2(index) {
  displayQuestion2(index);
  currentQuestionIndex2 = index;
  closeSidebar();
}

function switchToQuestionView() {
  document.getElementById("result-container").style.display = "none";
  document.getElementById("question-container2").style.display = "block";
  displayQuestion2(currentQuestionIndex2);
  showPerformanceAnalysis();
}

// Function to show the performance analysis and hide the question view
function switchToPerformanceAnalysis() {
  document.getElementById("result-container").style.display = "block";
  document.getElementById("question-container2").style.display = "none";
  displayQuestion2(currentQuestionIndex2);
  showPerformanceAnalysis();
}

// Function to display a question
async function displayQuestion2(index) {
  const questionContainer2 = document.getElementById("question-content2");
  const question = questions[index];

  // Calculate marks based on the type of question and the user's attempt
  let marks = 0;
  if (question.attempted) {
    if (question.type === "SCQ" || question.type === "Numerical") {
      if (question.userSelectedOption === question.correctAnswer) {
        marks = 4;
      } else {
        marks = -1;
      }
    } else if (question.type === "MCQ") {
      let correctCount = 0;
      question.userSelectedOption.forEach((optionIndex) => {
        if (question.correctAnswer.includes(optionIndex)) {
          correctCount++;
        } else {
          correctCount--;
        }
      });
      if (correctCount === question.correctAnswer.length) {
        marks = 4;
      } else {
        marks = -2;
      }
    }
  }

  let statusText = "";
  if (question.isMarked) {
    statusText = "Marked";
  } else if (question.isReviewed) {
    statusText = "Reviewed";
  }

  let chapterTopicText = "";
  if (question.chapters) {
    chapterTopicText = `Chapter: ${question.chapters}`;
  } else if (question.topics) {
    chapterTopicText = `Topic: ${question.topics}`;
  }

  let questionHtml = `
    <div class="main-container3">
      <div class="header3">
        <div class="chapter-topic3">
          <h3>${question.chapters ? `${question.chapters}` : ""}</h3>
        </div>
        <div class="open-sidebar-btn2" onclick="openSidebar()">
          <i class="fas fa-bars"></i>
        </div>
      </div>

      <div class="sub-header3">
        <div class="time-spent3">
          <p>Time Spent: ${
            question.timeTaken ? question.timeTaken.toFixed(2) : 0
          } seconds</p>
        </div>
        <div class="marks3">
          <p>Marks: ${marks}</p>
        </div>
        <div class="status3">
          <p>Status: ${statusText}</p>
        </div>
      </div>

      <div class="content-container3">
        <div class="question-info3">
          <div class="question-text3">
            <div class="question-number3">
                      <span class="Quest-Num">${index + 1}</span>
                      <button class="report-btn" ${
                        question.report ? "disabled" : ""
                      } onclick="openReportModal(${index})"><i class="fas fa-exclamation-triangle"></i></button>
                  </div>
                  ${question.text}</div>
          ${
            question.image
              ? `<div class="question-image3"><img src="${question.image}" alt="Question Image"></div>`
              : ""
          }
        </div>
        <div class="options-info3">
  `;

  if (question.type === "SCQ" || question.type === "MCQ") {
    questionHtml += '<div class="options2">';
    const optionLetters = ["A", "B", "C", "D"];
    question.options.forEach((option, optionIndex) => {
      let optionClass = "option2";
      if (question.attempted) {
        if (question.type === "SCQ") {
          if (optionIndex === question.userSelectedOption) {
            optionClass +=
              optionIndex === question.correctAnswer
                ? " correctSol correct-tick"
                : " incorrectSol incorrect-tick";
          }
          if (
            optionIndex === question.correctAnswer &&
            optionIndex !== question.userSelectedOption
          ) {
            optionClass += " correctSol";
          }
        } else if (question.type === "MCQ") {
          if (question.userSelectedOption.includes(optionIndex)) {
            optionClass += question.correctAnswer.includes(optionIndex)
              ? " correctSol correct-tick"
              : " incorrectSol correct-tick";
          }
          if (
            question.correctAnswer.includes(optionIndex) &&
            !question.userSelectedOption.includes(optionIndex)
          ) {
            optionClass += " correctSol";
          }
        }
      } else {
        if (optionIndex === question.correctAnswer) {
          optionClass += " correctSol";
        }
      }
      questionHtml += `<div class="${optionClass}"><span class="option-letter3">${
        optionLetters[optionIndex]
      }</span><div class="option-content3">${option.text}${
        option.image ? `<img src="${option.image}" alt="Option Image">` : ""
      }</div></div>`;
    });
    questionHtml += "</div>";
  } else if (question.type === "Numerical") {
    if (question.attempted) {
      const userAnswerClass =
        question.userSelectedOption === question.correctAnswer
          ? "correct2"
          : "incorrect2";
      questionHtml += `<div class="numerical-answer23">Your Answer: ${question.userSelectedOption} | Correct Answer: ${question.correctAnswer}</div>`;
    } else {
      questionHtml += `<div class="numerical-answer23">Correct Answer: ${question.correctAnswer} <span>(Not Attempted)</span></div>`;
    }
  }

  questionHtml += `
        </div>
      </div>

      <div class="solution-container3">
        <div class="solution3">
          <div class="solution-text3"><h3>Solution:</h3>
          ${
            question.topics
              ? `<p><strong>Topic:</strong> ${question.topics}</p>`
              : ""
          }
          <p>${question.solution.text}</p></div>
          ${
            question.solution.image
              ? `<div class="solution-image3"><img src="${question.solution.image}" alt="Solution Image"></div>`
              : ""
          }

        </div>
      </div>

    </div>


<!-- Report Modal -->
<div id="reportModal" class="modal">
<div class="modal-content">
  <span class="close" onclick="closeReportModal()">&times;</span>
  <h2>Report Issue</h2>
  <label for="reportReason" class="label">Select the issue:</label>
  <select id="reportReason" class="report-dropdown" onchange="handleReportReasonChange()">
      <option value="question">Mistake in Question</option>
      <option value="solution">Mistake in Solution</option>
      <option value="both">Mistake in Both</option>
      <option value="other">Other</option>
  </select>
  <textarea id="otherReason" class="report-textarea" placeholder="Please describe the issue" style="display:none;"></textarea>
  <div class="modal-footer">
      <button id="submitBtn" class="button" onclick="submitReport(${index})">Submit</button>
      <button class="button" onclick="closeReportModal()">Close</button>
  </div>
</div>

</div>


  `;

  questionContainer2.innerHTML = questionHtml;
  document.getElementById("question-index2").innerText = `Question ${
    index + 1
  } of ${questions.length}`;
  MathJax.typeset();
  updateSidebar2();
}

function openReportModal(questionIndex) {
  document.getElementById("reportModal").style.display = "block";
  document.getElementById("reportReason").value = "question";
  document.getElementById("otherReason").style.display = "none";
  document.getElementById("otherReason").value = "";
  window.currentQuestionIndex = questionIndex;
}

function closeReportModal() {
  document.getElementById("reportModal").style.display = "none";
}

function handleReportReasonChange() {
  const reportReason = document.getElementById("reportReason").value;
  if (reportReason === "other") {
    document.getElementById("otherReason").style.display = "block";
  } else {
    document.getElementById("otherReason").style.display = "none";
  }
}

async function submitReport(questionIndex) {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.innerText = "Submitting...";
  submitBtn.disabled = true;

  const reportReason = document.getElementById("reportReason").value;
  const otherReason = document.getElementById("otherReason").value;
  const reason = reportReason === "other" ? otherReason : reportReason;
  const userName = document.getElementById("user-name").textContent.trim();
  const reportData = {
    questionIndex: questionIndex + 1,
    reason: reason,
    userName: userName, // Replace with actual user name
    testName: "JEE Mains(24 Jan 2023- Morning)", // Replace with actual test name
    dateTime: new Date().toLocaleString(),
    questionText: questions[questionIndex].text,
  };

  const formBody = Object.keys(reportData)
    .map(
      (key) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(reportData[key])
    )
    .join("&");

  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbyYL4H_IPr5qUwyHYusvwrEGPeetmke4WFyeQ4t09oMl-oC43zXJ7rtpCyKXfjDFpCp/exec",
    {
      method: "POST",
      body: formBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (response.ok) {
    questions[questionIndex].report = true;
    submitBtn.innerText = "Submitted";
    setTimeout(closeReportModal, 1000);
  } else {
    alert("Failed to submit report.");
    submitBtn.innerText = "Submit";
    submitBtn.disabled = false;
  }
  displayQuestion2(questionIndex);
}
// Function to update the sidebar with question indices
function updateSidebar2() {
  const correctQuestions = document.getElementById("correct-questions2");
  const incorrectQuestions = document.getElementById("incorrect-questions2");
  const notAttemptedQuestions = document.getElementById(
    "not-attempted-questions2"
  );
  const markedQuestions = document.getElementById("marked-questions2");
  const reviewedQuestions = document.getElementById("reviewed-questions2");

  correctQuestions.innerHTML = "";
  incorrectQuestions.innerHTML = "";
  notAttemptedQuestions.innerHTML = "";
  markedQuestions.innerHTML = "";
  reviewedQuestions.innerHTML = "";

  questions.forEach((question, index) => {
    let questionBox = `<div class="question-box2" onclick="jumpToQuestion2(${index})">${
      index + 1
    }</div>`;

    if (question.correctAnswer === question.userSelectedOption) {
      correctQuestions.innerHTML += questionBox;
    } else if (
      question.attempted &&
      question.correctAnswer !== question.userSelectedOption
    ) {
      incorrectQuestions.innerHTML += questionBox;
    } else if (!question.attempted) {
      notAttemptedQuestions.innerHTML += questionBox;
    }

    if (question.isMarked) {
      markedQuestions.innerHTML += questionBox;
    }

    if (question.isReviewed) {
      reviewedQuestions.innerHTML += questionBox;
    }
  });
}

document.getElementById("prev-question2").addEventListener("click", () => {
  if (currentQuestionIndex2 > 0) {
    currentQuestionIndex2--;
    displayQuestion2(currentQuestionIndex2);
  }
});

document.getElementById("next-question2").addEventListener("click", () => {
  if (currentQuestionIndex2 < questions.length - 1) {
    currentQuestionIndex2++;
    displayQuestion2(currentQuestionIndex2);
  }
});

// Function to disable page refresh
function disableRefresh() {
  window.keydown = function () {
    return "Do you really want to leave this page?";
  };
  window.onbeforeunload = function () {
    return "Do you really want to leave this page?";
  };
}

window.addEventListener("beforeunload", function (e) {
  var confirmationMessage =
    "Are you sure you want to leave? Your changes may not be saved.";
  e.preventDefault(); // Standard for most browsers
  e.returnValue = confirmationMessage; // For legacy browsers
  return confirmationMessage; // For most modern browsers
});

// Optionally, to handle specific key combinations for refresh
window.addEventListener("keydown", function (e) {
  if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
    e.preventDefault();
    alert(
      "Refreshing the page will cause unsaved changes to be lost. Do you want to continue?"
    );
  }
});

function preventRefresh(event) {
  if (event.keyCode === 116 || (event.ctrlKey && event.keyCode === 82)) {
    event.preventDefault();
    event.returnValue = "";
    return false;
  }
}

// Function to protect site content from being copied and disable right-click
function protectContent() {
  document.addEventListener("copy", (e) => {
    e.preventDefault();
  });

  document.addEventListener("cut", (e) => {
    e.preventDefault();
  });

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.ctrlKey &&
      (e.keyCode === 67 || e.keyCode === 85 || e.keyCode === 83)
    ) {
      e.preventDefault();
    }
  });
}

// Function to prevent inspecting using keyboard shortcuts
function preventInspect() {
  document.addEventListener("keydown", (e) => {
    if (
      e.keyCode === 123 ||
      (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
      (e.ctrlKey && e.shiftKey && e.keyCode === 74)
    ) {
      e.preventDefault();
    }
  });
}

disableRefresh();
protectContent();
preventInspect();
