// Selectors
const setupWrapper = document.querySelector('.setup-wrapper');
const quizCategory = document.querySelector('.quiz-category');
const quizLimit = document.querySelector('.quiz-limit');
const quizDifficulty = document.getElementsByName('difficulty');
const startQuizBtn = document.querySelector('.start-btn');

const questionElement = document.getElementById('question');
const optionsListElement = document.querySelector('.quiz-options');
const checkAnswerBtn = document.getElementById('check-answer');
const playAgainBtn = document.getElementById('play-again');
const resultElement = document.getElementById('result');
const correctScoreElement = document.getElementById('correct-score');
const totalQuestionElement = document.getElementById('total-question');

// Variables
let category = '';
let limit = '';
let difficulty = '';

let correctAnswer = '';
let correctScore = 0;
let askedCount = 0;
const totalQuestion = 10;

// Load a question from the API
async function loadQuestion() {
    try {
        const settings = loadSettings();
        const APIUrl = `https://opentdb.com/api.php?amount=${settings.limit}&category=${settings.category}&difficulty=${settings.difficulty}`;
        const result = await fetch(APIUrl);
        const data = await result.json();
        resultElement.innerHTML = '';
        showQuestion(data.results[0]);
    } catch (error) {
        console.error('Error loading question:', error);
    }
}

// Event listeners setup
function eventListeners() {
    checkAnswerBtn.addEventListener('click', checkAnswer);
    playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function () {
    loadQuestion();
    eventListeners();
    setCount();
});

// Display a question and its options
function showQuestion(data) {
    checkAnswerBtn.disabled = false;
    correctAnswer = data.correct_answer;
    const incorrectAnswers = data.incorrect_answers;
    const optionsList = [...incorrectAnswers, correctAnswer];
    shuffleArray(optionsList);

    questionElement.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    optionsListElement.innerHTML = optionsList.map((option, index) => `
        <li>${index + 1}. <span>${option}</span></li>
    `).join('');
    selectOption();
}

// Shuffle an array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Select an option when clicked
function selectOption() {
    optionsListElement.querySelectorAll('li').forEach(function (option) {
        option.addEventListener('click', function () {
            if (optionsListElement.querySelector('.selected')) {
                const activeOption = optionsListElement.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// Check the user's answer
function checkAnswer() {
    checkAnswerBtn.disabled = true;
    if (optionsListElement.querySelector('.selected')) {
        const selectedAnswer = optionsListElement.querySelector('.selected span').textContent;
        if (selectedAnswer === HTMLDecode(correctAnswer)) {
            correctScore++;
            resultElement.innerHTML = `<p><i class="fas fa-check"></i>Correct Answer!</p>`;
        } else {
            resultElement.innerHTML = `<p><i class="fas fa-times"></i>Incorrect Answer!</p><small><b>Correct Answer:</b> ${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        resultElement.innerHTML = `<p><i class="fas fa-question"></i>Please select an option!</p>`;
        checkAnswerBtn.disabled = false;
    }
}

// Decode HTML entities into normal text for correct answer
function HTMLDecode(textString) {
    const doc = new DOMParser().parseFromString(textString, 'text/html');
    return doc.documentElement.textContent;
}

// Check the count of asked questions
function checkCount() {
    askedCount++;
    setCount();
    if (askedCount === totalQuestion) {
        resultElement.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        playAgainBtn.style.display = 'block';
        checkAnswerBtn.style.display = 'none';
    } else {
        setTimeout(loadQuestion, 1000);
    }
}

// Set question count and correct score
function setCount() {
    totalQuestionElement.textContent = totalQuestion;
    correctScoreElement.textContent = correctScore;
}

// Restart the quiz
function restartQuiz() {
    correctScore = askedCount = 0;
    playAgainBtn.style.display = 'none';
    checkAnswerBtn.style.display = 'block';
    checkAnswerBtn.disabled = false;
    setCount();
    window.location.href = 'index.html';
}

if (startQuizBtn !== null) {
    startQuizBtn.addEventListener('click', () => {
        setUpSettings();
        if (category === 'Select Category' || limit === 'Select number of questions' || difficulty === '') {
            alert('Please select all the fields');
        } else {
            saveSettings();
            setTimeout(() => {
                window.location.href = 'quiz.html';
            }, 300);
        }
    });
}

// Function to get the selected difficulty
function getDifficulty() {
    for (let i = 0; i < quizDifficulty.length; i++) {
        if (quizDifficulty[i].checked) {
            return quizDifficulty[i].value;
        }
    }
}

// Function to set up quiz settings
function setUpSettings() {
    category = quizCategory.value;
    limit = quizLimit.value;
    difficulty = getDifficulty();
}

// Save settings to local storage
function saveSettings() {
    localStorage.setItem('category', category);
    localStorage.setItem('limit', limit);
    localStorage.setItem('difficulty', difficulty);
}

// Load settings from local storage
function loadSettings() {
    const settings = {};
    if (localStorage.getItem('category') !== null) {
        settings.category = localStorage.getItem('category');
    }
    if (localStorage.getItem('limit') !== null) {
        settings.limit = localStorage.getItem('limit');
    }
    if (localStorage.getItem('difficulty') !== null) {
        settings.difficulty = localStorage.getItem('difficulty');
    }
    return settings;
}

// When an answer is clicked
document.querySelectorAll('.quiz-options li').forEach(function(option) {
    option.addEventListener('click', function() {
        // Remove the 'selected' class from all answers
        document.querySelectorAll('.quiz-options li').forEach(function(item) {
            item.classList.remove('selected');
        });
        
        // Add the 'selected' class to the selected answer
        option.classList.add('selected');
    });
});
