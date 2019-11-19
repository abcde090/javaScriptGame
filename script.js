const CARD_TECHS = [
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws'
];

const game = {
  score: 0,
  level: 1,
  preSelected: null,
  checkMatching: false,
  gameOver: true,
  totalCards: 0,
  clearedCards: 0,
  gameBoard: null,
  timer: 60,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null
};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  game.gameBoard = document.querySelector('.game-board');
  game.timerDisplay = document.querySelector('.game-timer__bar');
  game.scoreDisplay = document.querySelector('.game-stats__score--value');
  game.levelDisplay = document.querySelector('.game-stats__level--value');
  game.startButton = document.querySelector('.game-stats__button');

  bindStartButton();
}

function startGame() {
  clearGameBoard();
  game.startButton.innerHTML = 'End Game';
  // init game
  game.checkMatching = false;
  game.clearedCards = 0;
  game.level = 1;
  game.gameOver = false;
  game.score = 0;
  game.preSelected = null;
  game.totalCards = 0;
  game.clearedCards = 0;
  generateCards();
  bindCardClick();
  game.levelDisplay.innerHTML = game.level;
  game.scoreDisplay.innerHTML = game.score;

  startTimer();
}


function handleCardFlip() {
  if (game.checkMatching || game.gameOver) {
    return;
  }

  const currentSelected = this;

  if (currentSelected === game.preSelected) {
    currentSelected.classList.remove('card--flipped');
    game.preSelected = null;
    return;
  }
  currentSelected.classList.add('card--flipped');
  // check if preselected already
  if (game.preSelected) {
    // check match
    checkCardMatching(currentSelected, game.preSelected);
    return;
  }
  game.preSelected = currentSelected;
}

function checkCardMatching(card1, card2) {
  if (card1.dataset.tech === card2.dataset.tech) {
    unBindCardClick(card1);
    unBindCardClick(card2);
    game.preSelected = null;
    game.clearedCards += 2;
    updateScore();

    if (game.clearedCards === game.totalCards) {
      stopTimer();
      setTimeout(() => nextLevel(), 1500);
    }
  } else {
    game.checkMatching = true;
    setTimeout(() => {
      card1.classList.remove('card--flipped');
      card2.classList.remove('card--flipped');
      game.preSelected = null;
      game.checkMatching = false;
    }, 1000);
  }
}

function nextLevel() {
  // level 4 is the end;
  if (game.level === 3) {
    handleGameOver();
    return;
  }
  // clear current game board
  clearGameBoard();

  game.level++;
  game.levelDisplay.innerHTML = game.level;
  game.clearedCards = 0;
  game.totalCards = 0;

  generateCards();
  bindCardClick();
  startTimer();
}

function handleGameOver() {
  game.startButton.innerHTML = 'Start Game';
  clearInterval(game.timerInterval);
  game.gameOver = true;
  alert('Congratulations, your score is ' + game.score);
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
  const score = game.level * game.level * game.timer;
  game.score += score;
  game.scoreDisplay.innerHTML = game.score;
}

function updateTimerDisplay() {
  game.timerDisplay.innerHTML = `${game.timer}s`;
  const percentage = (game.timer / 60) * 100;
  game.timerDisplay.style.width = percentage + '%';
}

function clearGameBoard() {
  const { gameBoard } = game;
  while (gameBoard.firstChild) {
    gameBoard.firstChild.removeEventListener('click', handleCardFlip);
    gameBoard.removeChild(gameBoard.firstChild);
  }
}

function stopTimer() {
  clearInterval(game.timerInterval);
  game.timerInterval = null;
}

function startTimer() {
  if (game.timerInterval) {
    stopTimer();
  }
  game.timer = 60;
  updateTimerDisplay();
  game.timerInterval = setInterval(() => {
    game.timer--;
    updateTimerDisplay();
    if (game.timer === 0) {
      handleGameOver();
    }
  }, 1000);
}

function generateCards() {
  const gameBoard = game.gameBoard;
  const gameSize = game.level * 2;
  const totalCards = gameSize * gameSize;
  game.totalCards = totalCards;
  gameBoard.style['grid-template-columns'] = `repeat(${gameSize}, 1fr)`;
  const cards = [];
  for (let i = 0; i < totalCards / 2; i++) {
    const tech = CARD_TECHS[i % CARD_TECHS.length];
    const card = createCardElement(tech);
    cards.push(card);
    cards.unshift(card.cloneNode(true));
  }
  while (cards.length > 0) {
    const index = Math.floor(Math.random() * cards.length);
    const card = cards.splice(index, 1)[0];
    gameBoard.appendChild(card);
  }
}

function createCardElement(tech) {
  const node = document.createElement('div');
  const cardFront = document.createElement('div');
  const cardBack = document.createElement('div');

  cardFront.classList.add('card__face', 'card__face--front');
  cardBack.classList.add('card__face', 'card__face--back');
  node.classList.add('card', tech);
  node.dataset.tech = tech;

  node.appendChild(cardFront);
  node.appendChild(cardBack);
  return node;
}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  game.startButton.addEventListener('click', () => {
    if (game.gameOver) {
      startGame();
    } else {
      handleGameOver();
    }
  });
}

function unBindCardClick(card) {
  card.removeEventListener('click', handleCardFlip);
}

function bindCardClick() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', handleCardFlip);
  });
}
