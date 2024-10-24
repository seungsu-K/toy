import '/style.css';

import { getCellNode } from './src/getCellNode';
import { createCells } from './src/createCells';
import { setMines } from './src/setMines';
import { isValidCell } from './src/isValidCell';
import { setBoard } from './src/setBoard';

const setting = {
  초급: {
    boardSize: { rows: 9, cols: 9 },
    mines: 10,
  },
  중급: {
    boardSize: { rows: 16, cols: 16 },
    mines: 40,
  },
  고급: {
    boardSize: { rows: 24, cols: 20 },
    mines: 99,
  },
};
let level = '초급';
let cells = [];
let gameOver = false;
let leftMines = setting[level].mines;
let time = 0;
let timer = false;
let timeInterval;

const board = document.querySelector('#board');
const levelSelect = document.querySelector('#level');
const infoMines = document.querySelector('#mines');
const restartButton = document.querySelector('.button_restart');
const infoTimer = document.querySelector('#time');
const result = document.querySelector('#result');

function initGame(level) {
  const { boardSize, mines } = setting[level];
  const { rows, cols } = boardSize;

  gameOver = false;
  leftMines = setting[level].mines;
  cells = createCells(rows, cols);

  resetTimer();
  resetResult();
  setBoard(board, level);
  setMines(rows, cols, cells, mines);
  renderLeftMines(leftMines);
  renderBoard(rows, cols);
}

function renderLeftMines(mines) {
  infoMines.textContent = `${mines}`;
}

function renderBoard(rows, cols) {
  board.innerHTML = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleLeftClick);
      cell.addEventListener('contextmenu', handleRightClick);
      board.appendChild(cell);
    }
  }
}

function handleLeftClick(e) {
  const { boardSize, mines } = setting[level];
  const { rows, cols } = boardSize;
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  const cell = cells[row][col];

  if (gameOver) return;

  if (!cell.opened) {
    openCell(row, col, rows, cols);
  } else {
    clickOpenedCell(row, col, rows, cols);
  }

  if (checkWin(rows, cols, mines)) {
    gameOver = true;
    renderResult('You Win 🎉');
    clearInterval(timeInterval);
  }
}

function handleRightClick(e) {
  e.preventDefault();
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  if (gameOver) return;

  putFlag(row, col, cells, leftMines);
}

function openCell(row, col, rows, cols) {
  const cellEl = getCellNode(row, col);
  const cell = cells[row][col];

  if (gameOver || cell.opened || cell.flagged) return;

  if (time === 0 && !timer) {
    startTimer();
    timer = true;
  }

  cellEl.classList.add('is-opened');
  cell.opened = true;

  if (cell.mine) {
    cellEl.classList.add('mine');
    gameOver = true;
    renderResult('Game Over 💣');
    clearInterval(timeInterval);
    timer = false;

    return;
  }

  const minesAround = countMinesAround(row, col, rows, cols);

  if (minesAround === 0) {
    cellEl.classList.add(`num${minesAround}`);
    openAroundCell(row, col, rows, cols);
  } else {
    cellEl.classList.add(`num${minesAround}`);
  }
}

function openAroundCell(row, col, rows, cols) {
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const checkRow = row + r;
      const checkCol = col + c;

      if (
        isValidCell(checkRow, checkCol, rows, cols) &&
        !cells[checkRow][checkCol].opened
      ) {
        openCell(checkRow, checkCol, rows, cols);
      }
    }
  }
}

function countMinesAround(row, col, rows, cols) {
  let count = 0;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const checkRow = row + r;
      const checkCol = col + c;

      if (
        isValidCell(checkRow, checkCol, rows, cols) &&
        cells[checkRow][checkCol].mine
      )
        count++;
    }
  }

  return count;
}

function clickOpenedCell(row, col, rows, cols) {
  const minesAround = countMinesAround(row, col, rows, cols);
  const flagAround = countFlagsAround(row, col, rows, cols);

  if (minesAround === flagAround) {
    openAroundCell(row, col, rows, cols);
  }
}

function countFlagsAround(row, col, rows, cols) {
  let count = 0;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const checkRow = row + r;
      const checkCol = col + c;

      if (
        isValidCell(checkRow, checkCol, rows, cols) &&
        cells[checkRow][checkCol].flagged
      ) {
        count++;
      }
    }
  }
  return count;
}

function putFlag(row, col, cells) {
  const cellEl = getCellNode(row, col);
  const cell = cells[row][col];

  if (cell.opened) return;

  if (!cell.flagged) {
    if (leftMines === 0) {
      return;
    }
    cellEl.classList.toggle('is-flagged');
    cell.flagged = !cell.flagged;
    leftMines = updateLeftMines(-1, leftMines);
  } else {
    cellEl.classList.toggle('is-flagged');
    cell.flagged = !cell.flagged;
    leftMines = updateLeftMines(1, leftMines);
  }

  renderLeftMines(leftMines);
}

function updateLeftMines(add, mines) {
  mines += add;

  return mines;
}

function startTimer() {
  timeInterval = setInterval(() => {
    time++;
    infoTimer.textContent = `${time}`;
  }, 1000);
}

function resetTimer() {
  clearInterval(timeInterval);
  time = 0;
  timer = false;
  infoTimer.textContent = '0';
}

function renderResult(message) {
  result.textContent = message;
  result.classList.remove('hidden');
}

function resetResult() {
  result.textContent = '';
  result.classList.add('hidden');
}

function checkWin(rows, cols, mines) {
  const cells = document.querySelectorAll('.is-opened');
  return cells.length + mines === rows * cols;
}

restartButton.addEventListener('click', () => initGame(level));
levelSelect.addEventListener('change', (e) => {
  level = e.target.value;
  leftMines = setting[level].mines;
  initGame(level);
});

initGame(level);
