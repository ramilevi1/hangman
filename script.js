const words = [
    "JAVASCRIPT", "PYTHON", "INTERFACE", "BROWSER", "DEVELOPER", 
    "VARIABLE", "FUNCTION", "COMPONENT", "FRAMEWORK", "DEBUGGING",
    "ALGORITHM", "DATABASE", "KEYBOARD", "MONITOR", "INTERNET"
];

const maxMistakes = 6;
let currentWord = "";
let guessedLetters = [];
let mistakes = 0;
let playerName = "";
let wins = 0;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const nameInput = document.getElementById('player-name-input');
const startBtn = document.getElementById('start-btn');
const playerNameDisplay = document.getElementById('player-name-display');
const wordDisplay = document.getElementById('word-display');
const keyboard = document.getElementById('keyboard');
const hangmanParts = document.querySelectorAll('.draw.part');
const messageArea = document.getElementById('message-area');
const restartBtn = document.getElementById('restart-btn');
const winCountDisplay = document.getElementById('win-count');

// Initialize
startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
        playerName = name;
        playerNameDisplay.textContent = playerName;
        transitionToGame();
        startNewGame();
    } else {
        nameInput.style.borderColor = 'var(--danger-color)';
        setTimeout(() => nameInput.style.borderColor = 'var(--text-secondary)', 1000);
    }
});

restartBtn.addEventListener('click', startNewGame);

function transitionToGame() {
    welcomeScreen.classList.remove('active');
    welcomeScreen.classList.add('hidden');
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        setTimeout(() => {
            gameScreen.classList.remove('hidden');
            gameScreen.classList.add('active');
        }, 50);
    }, 500);
}

function startNewGame() {
    // Reset State
    currentWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    mistakes = 0;
    
    // Reset UI
    messageArea.textContent = "";
    messageArea.style.color = "var(--text-primary)";
    restartBtn.classList.add('hidden');
    hangmanParts.forEach(part => part.style.display = 'none');
    
    renderWord();
    renderKeyboard();
}

function renderWord() {
    wordDisplay.innerHTML = '';
    const letters = currentWord.split('');
    let isWon = true;

    letters.forEach(letter => {
        const slot = document.createElement('div');
        slot.classList.add('letter-slot');
        if (guessedLetters.includes(letter)) {
            slot.textContent = letter;
            slot.classList.add('filled');
        } else {
            isWon = false;
        }
        wordDisplay.appendChild(slot);
    });

    if (isWon) {
        handleWin();
    }
}

function renderKeyboard() {
    keyboard.innerHTML = '';
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    alphabet.split('').forEach(letter => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.classList.add('key');
        
        if (guessedLetters.includes(letter)) {
            btn.disabled = true;
            if (currentWord.includes(letter)) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('wrong');
            }
        }
        
        btn.addEventListener('click', () => handleGuess(letter));
        keyboard.appendChild(btn);
    });
}

function handleGuess(letter) {
    if (guessedLetters.includes(letter) || mistakes >= maxMistakes) return;

    guessedLetters.push(letter);

    if (currentWord.includes(letter)) {
        // Correct guess
        renderWord();
        renderKeyboard();
    } else {
        // Wrong guess
        mistakes++;
        updateHangman();
        renderKeyboard();
        
        if (mistakes >= maxMistakes) {
            handleLoss();
        }
    }
}

function updateHangman() {
    // Show parts based on mistakes (1-indexed in NodeList vs 0-indexed mistakes)
    // mistakes 1 -> show part 0
    if (mistakes > 0 && mistakes <= hangmanParts.length) {
        hangmanParts[mistakes - 1].style.display = 'block';
    }
}

function handleWin() {
    messageArea.textContent = `You won! The word was ${currentWord}`;
    messageArea.style.color = "var(--success-color)";
    disableKeyboard();
    restartBtn.classList.remove('hidden');
    wins++;
    winCountDisplay.textContent = wins;
}

function handleLoss() {
    messageArea.textContent = `Game Over! The word was ${currentWord}`;
    messageArea.style.color = "var(--danger-color)";
    disableKeyboard();
    restartBtn.classList.remove('hidden');
}

function disableKeyboard() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => key.disabled = true);
}
