import { getCellNode } from './src/getCellNode';
import { createCells } from './src/createCells';
import { setMines } from './src/setMines';
import '/style.css';
import { isValidCell } from './src/isValidCell';

const boardSize = 9;
const rows = 9;
const cols = 9;
const mines = 10;
let cells = createCells(rows, cols);

const board = document.querySelector('#board');
const restartButton = document.querySelector('.button_restart');

let gameOver = false;

function renderBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', (e) => {
        if (e.button === 0 && !cell.classList.contains('is-opened')) {
          clickCell(row, col);
        } else {
          clickOpenedCell(row, col);
        }
      });
      cell.addEventListener('contextmenu', (e) => {
        putFlag(e, row, col);
      });
      board.appendChild(cell);
    }
  }
}

renderBoard();

setMines(rows, cols, cells, mines);

function clickCell(row, col) {
  const cell = getCellNode(row, col);

  if (gameOver || cells[row][col].opened || cells[row][col].flagged) return;

  cell.classList.add('is-opened');
  cells[row][col].opened = true;

  if (cells[row][col].mine) {
    cell.classList.add('mine');
    alert('Game Over');
    gameOver = true;
    return;
  }

  const minesAround = minesAroundCell(row, col);

  if (minesAround === 0) {
    openAroundCell(row, col);
  } else {
    cell.classList.add(`num${minesAround}`);
  }

  if (checkWin()) {
    alert('Win');
    gameOver = true;
  }
}

function openAroundCell(row, col) {
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const checkRow = row + r;
      const checkCol = col + c;
      const aroundCell = getCellNode(checkRow, checkCol);
      if (
        isValidCell(checkRow, checkCol, boardSize) &&
        !aroundCell.classList.contains('is-opened')
      ) {
        clickCell(checkRow, checkCol);
      }
    }
  }
}

function minesAroundCell(row, col) {
  let count = 0;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const checkRow = row + r;
      const checkCol = col + c;
      if (
        isValidCell(checkRow, checkCol, boardSize) &&
        cells[checkRow][checkCol].mine
      )
        count++;
    }
  }

  return count;
}

function checkFlagsAndMines(row, col) {
  let count = 0;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const checkRow = row + r;
      const checkCol = col + c;
      const aroundCell = getCellNode(checkRow, checkCol);
      if (
        checkRow >= 0 &&
        checkRow < rows &&
        checkCol >= 0 &&
        checkCol < cols &&
        cells[checkRow][checkCol].mine &&
        aroundCell.classList.contains('is-flagged')
      ) {
        count++;
      }
    }
  }
  return count;
}

function clickOpenedCell(row, col) {
  if (checkFlagsAndMines(row, col) === minesAroundCell(row, col)) {
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const checkRow = row + r;
        const checkCol = col + c;

        if (
          checkRow >= 0 &&
          checkRow < rows &&
          checkCol >= 0 &&
          checkCol < cols
        ) {
          clickCell(checkRow, checkCol);
        }
      }
    }
  }
}

function putFlag(e, row, col) {
  e.preventDefault();
  const cell = getCellNode(row, col);

  if (gameOver || cell.classList.contains('is-opened')) return;

  cell.classList.toggle('is-flagged');
  cells[row][col].flagged = true;
}

function restartGame() {
  gameOver = false;

  const cellsEl = document.querySelectorAll('.cell');
  cellsEl.forEach((cell) => (cell.className = 'cell'));

  cells = createCells(rows, cols);
  setMines(rows, cols, cells, mines);
}

function checkWin() {
  const cells = document.querySelectorAll('.is-opened');
  return cells.length + mines === rows * cols;
}

restartButton.addEventListener('click', restartGame);
