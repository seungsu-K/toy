import '/style.css';

const boardSize = 9;
const rows = 9;
const cols = 9;

const minesCount = 10;

const board = document.querySelector('#board');

let gameOver = false;

function renderBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', clickCell);
      board.appendChild(cell);
    }
  }
}

renderBoard();

let mines = new Array(rows)
  .fill(null)
  .map(() => new Array(cols).fill(null).map(() => false));

function setMines() {
  let setMines = 0;

  while (setMines < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!mines[row][col]) {
      mines[row][col] = true;
      setMines++;
    }
  }

  return mines;
}

setMines();

function clickCell() {
  if (gameOver || this.classList.contains('is-opened')) return;

  let cell = this;
  cell.classList.add('is-opened');

  if (mines[cell.dataset.row][cell.dataset.col]) {
    cell.classList.add('mine');
    alert('Game Over');
    gameOver = true;
    return;
  }
}

function resetMines() {
  mines = new Array(rows)
    .fill(null)
    .map(() => new Array(cols).fill(null).map(() => false));

  setMines();
}

function restartGame() {
  gameOver = false;
  const cells = document.querySelectorAll('.is-opened');
  cells.forEach((cell) => cell.classList.remove('is-opened'));

  const mine = document.querySelector('.mine');
  mine.classList.remove('mine');

  resetMines();
}

const restartButton = document.querySelector('.button_restart');

restartButton.addEventListener('click', restartGame);
