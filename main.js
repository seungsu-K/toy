import { getCellNode } from './src/getCellNode';
import { createCells } from './src/createCells';
import { setMines } from './src/setMines';
import '/style.css';
import { isValidCell } from './src/isValidCell';
import { putFlag } from './src/putFlag';

const boardSize = 9;
// const rows = 9;
// const cols = 9;
const mines = 10;
let cells = createCells(boardSize, boardSize);

const board = document.querySelector('#board');
const restartButton = document.querySelector('.button_restart');

let gameOver = false;

function renderBoard() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
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
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  const cell = cells[row][col];

  if (!cell.opened) {
    openCell(row, col);
  } else {
    clickOpenedCell(row, col);
  }
}

function handleRightClick(e) {
  e.preventDefault();
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  if (gameOver) return;

  putFlag(row, col, cells);
}

function openCell(row, col) {
  const cellEl = getCellNode(row, col);
  const cell = cells[row][col];

  if (gameOver || cell.opened || cell.flagged) return;

  cellEl.classList.add('is-opened');
  cell.opened = true;

  if (cell.mine) {
    cellEl.classList.add('mine');
    alert('Game Over');
    gameOver = true;
    return;
  }

  const minesAround = countMinesAround(row, col);

  if (minesAround === 0) {
    openAroundCell(row, col);
  } else {
    cellEl.classList.add(`num${minesAround}`);
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

      if (
        isValidCell(checkRow, checkCol, boardSize) &&
        !cells[checkRow][checkCol].opened
      ) {
        openCell(checkRow, checkCol);
      }
    }
  }
}

function countMinesAround(row, col) {
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

function clickOpenedCell(row, col) {
  const minesAround = countMinesAround(row, col);
  const flagAround = countFlagsAround(row, col);

  if (minesAround === flagAround) {
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const checkRow = row + r;
        const checkCol = col + c;

        if (isValidCell(checkRow, checkCol, boardSize)) {
          if (!cells[checkRow][checkCol].opened) {
            openCell(checkRow, checkCol);
          }

          if (
            cells[checkRow][checkCol].flagged &&
            !cells[checkRow][checkCol].mine
          ) {
            return;
          }
        }
      }
    }
  }
}

function countFlagsAround(row, col) {
  let count = 0;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const checkRow = row + r;
      const checkCol = col + c;

      if (
        isValidCell(checkRow, checkCol, boardSize) &&
        cells[checkRow][checkCol].flagged
      ) {
        count++;
      }
    }
  }
  return count;
}

function restartGame() {
  gameOver = false;

  const cellsEl = document.querySelectorAll('.cell');
  cellsEl.forEach((cell) => (cell.className = 'cell'));

  cells = createCells(boardSize, boardSize);
  setMines(boardSize, cells, mines);
}

function checkWin() {
  const cells = document.querySelectorAll('.is-opened');
  return cells.length + mines === boardSize * boardSize;
}

restartButton.addEventListener('click', restartGame);
renderBoard();
setMines(boardSize, cells, mines);
