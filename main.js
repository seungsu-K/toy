import '/style.css';

// const boardSize = 9;
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

  const cell = this;
  cell.classList.add('is-opened');

  const row = +cell.dataset.row;
  const col = +cell.dataset.col;

  if (mines[row][col]) {
    cell.classList.add('mine');
    alert('Game Over');
    gameOver = true;
    return;
  } else {
    cell.classList.add(`num${checkAroundCell(row, col)}`);
  }
}

function checkAroundCell(row, col) {
  let minesAroundCell = 0;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      let checkRow = row + r;
      let checkCol = col + c;
      if (
        checkRow >= 0 &&
        checkRow < rows &&
        checkCol >= 0 &&
        checkCol < cols &&
        mines[checkRow][checkCol]
      )
        minesAroundCell++;
    }
  }

  return minesAroundCell;
}

function resetMines() {
  mines = new Array(rows)
    .fill(null)
    .map(() => new Array(cols).fill(null).map(() => false));

  setMines();
}

function restartGame() {
  gameOver = false;

  const cells = document.querySelectorAll('.cell');

  if (cells) cells.forEach((cell) => (cell.className = 'cell'));

  resetMines();
}

const restartButton = document.querySelector('.button_restart');

restartButton.addEventListener('click', restartGame);
