// Initialize counters
const Navbar = document.querySelector(".Navbar");
const StartQuizBtn = document.querySelector(".start-btn");
const PopupInfo = document.querySelector(".popup-info");
const HomeContent = document.querySelector(".container");
const videoContainer = document.querySelector(".video-container");

const ExitBtn_Popup = document.querySelector(".exit-btn");
const ContinueBtn_Popup = document.querySelector(".continue-btn");

const QuestionElement = document.getElementById("Question");
const AnswerButton = document.getElementById("answer-buttons");
const NextQuestBtn = document.getElementById("next-btn");
const RestartBtn = document.getElementById("Restart-btn");

const PreviousQuestBtn = document.getElementById("previous-Btn");
const HomeBtn = document.getElementById("home-Btn");

const userAnswers = [];
var quizData = [];

let currentQuestionIndex = 0;
let score = 0;

// Initialize total time and startTime at the global scope
let totalTime = 0;
let startTime;

function goHome() {
    location.reload();
}

async function fetchQuizQuestions() {
    try {
        // Fetch data from the API
        const response = await fetch(
          `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`
        );
        const data = await response.json();

        // Check if the response contains results
        if (data.results) {
            // Process the questions and return them
            return data.results.map((question) => {
                // Combine correct and incorrect answers
                const allAnswers = [
                    ...question.incorrect_answers,
                    question.correct_answer,
                ];

                // Shuffle the answers randomly
                const shuffledAnswers = shuffleArray(allAnswers);

                return {
                    question: question.question,
                    answers: shuffledAnswers,
                    correctAnswer: question.correct_answer,
                };
            });
        } else {
            console.error("Error fetching questions:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
}

// Function to shuffle an array randomly
function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function StartQuiz() {
    HomeContent.classList.add("active");
    videoContainer.classList.add("active");

    PopupInfo.classList.add("active");
    Navbar.classList.add("active");
}

// Add this function to close the quiz popup
function closeQuizPopup() {
    HomeContent.classList.remove("active");
    videoContainer.classList.remove("active");

    PopupInfo.classList.remove("active");
    Navbar.classList.remove("active");
}

function ContinueQuiz() {
    document.querySelector(".main-app").classList.add("active");
    PopupInfo.classList.remove("active");

    // Display the first question
    fetchQuizQuestions().then((questions) => {
        // Set the fetched questions to the global quizData variable
        quizData = questions;

        // Start the quiz by displaying the first question
        showQuestion();
        startTime = new Date().getTime();
    });
}

function resetState() {
    NextQuestBtn.style.display = "none";
    while (AnswerButton.firstChild) {
        AnswerButton.removeChild(AnswerButton.firstChild);
    }
}

function selectAnswer(e) {
    const selectBtn = e.target;

    // Check if the selected answer is correct
    const isCorrect = selectBtn.dataset.correct === "true";

    if (isCorrect) {
        selectBtn.classList.add("correct");
        score++;
    } else {
        selectBtn.classList.add("incorrect");
    }

    Array.from(AnswerButton.children).forEach((button, index) => {
        // Check if the current button is the correct answer
        const isCorrectAnswer = button.dataset.correct === "true";
        // Add 'correct' class to the correct answer
        if (isCorrectAnswer) {
            button.classList.add("correct");
        }

        button.disabled = true;
    });

    NextQuestBtn.style.display = "block";
}

function showQuestion() {
    resetState();

    let currentQuestion = quizData[currentQuestionIndex];
    let QuestionNo = currentQuestionIndex + 1;

    QuestionElement.innerHTML = QuestionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.innerHTML = answer;
        button.classList.add("btn");
        AnswerButton.appendChild(button);

        if (answer === currentQuestion.correctAnswer) {
            button.dataset.correct = "true";
        }

        button.addEventListener("click", selectAnswer);
    });

    // Update the timer every second
    const timerElement = document.getElementById("timer");
    const timerInterval = setInterval(() => {
        const currentTime = new Date().getTime();

        const elapsedTimeInMilliseconds = currentTime - startTime;
        const elapsedTimeInSeconds = Math.floor(elapsedTimeInMilliseconds / 1000);
        totalTime = elapsedTimeInSeconds;

        timerElement.innerHTML = `${padZero(Math.floor(totalTime / 60))}:${padZero(
            totalTime % 60
        )}`;
    }, 1000);

    // Store the timer interval for later clearing
    quizData[currentQuestionIndex].timerInterval = timerInterval;
}

// Function to pad zero for single-digit numbers
function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

// Add this function to move to the next question
function nextQuestion() {

    // Continue with the next question
    currentQuestionIndex++;

    if (currentQuestionIndex > 0) {
        PreviousQuestBtn.style.display = "block";
    }

    if (currentQuestionIndex < quizData.length) {
        // Display the next question
        showQuestion();
    } else {
        // Quiz is finished, show the result popup
        showScore();
        console.log(totalTime);
    }
}

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${padZero(minutes)}:${padZero(seconds)}`;
}

function PreviousQuestBtnClick() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }

    // Update the display of Previous button based on the current question index
    if (currentQuestionIndex === 0) {
        PreviousQuestBtn.style.display = "none";
    } else {
        PreviousQuestBtn.style.display = "block";
    }
}

function showScore() {
    resetState();
    QuestionElement.innerHTML = `You Scored ${score} out of ${quizData.length
        } ! And your Total Time: ${formatTime(totalTime)} s `;

    RestartBtn.style.display = "block";
    PreviousQuestBtn.style.display = "none";
    document.getElementById("timer").style.display = "none";
}

function Restart() {
    resetState();

    currentQuestionIndex = 0;
    quizData = [];
    score = 0;

    ContinueQuiz();
    RestartBtn.style.display = "none";
}
