import '/style.css';

import { getCellNode } from './src/getCellNode';
import { createCells } from './src/createCells';
import { setMines } from './src/setMines';
import { isValidCell } from './src/isValidCell';
import { putFlag } from './src/putFlag';
import { setBoard } from './src/setBoard';

const levelSelect = document.querySelector('#level');
let level = levelSelect.value;

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
    boardSize: { rows: 20, cols: 24 },
    mines: 99,
  },
};

let cells = [];
let gameOver = false;

const board = document.querySelector('#board');
const restartButton = document.querySelector('.button_restart');

function initGame(level) {
  const { boardSize, mines } = setting[level];
  const { rows, cols } = boardSize;

  gameOver = false;
  cells = createCells(rows, cols);

  setMines(rows, cols, cells, mines);
  renderBoard(rows, cols, level);
}

function renderBoard(rows, cols, level) {
  board.innerHTML = '';

  setBoard(board, level);

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

  if (!cell.opened) {
    openCell(row, col, rows, cols, mines);
  } else {
    clickOpenedCell(row, col, rows, cols, mines);
  }
}

function handleRightClick(e) {
  e.preventDefault();
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  if (gameOver) return;

  putFlag(row, col, cells);
}

function openCell(row, col, rows, cols, mines) {
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

  const minesAround = countMinesAround(row, col, rows, cols);

  if (minesAround === 0) {
    openAroundCell(row, col, rows, cols, mines);
  } else {
    cellEl.classList.add(`num${minesAround}`);
  }

  if (checkWin(rows, cols, mines)) {
    alert('Win');
    gameOver = true;
  }
}

function openAroundCell(row, col, rows, cols, mines) {
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      const checkRow = row + r;
      const checkCol = col + c;

      if (
        isValidCell(checkRow, checkCol, rows, cols) &&
        !cells[checkRow][checkCol].opened
      ) {
        openCell(checkRow, checkCol, rows, cols, mines);
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

function clickOpenedCell(row, col, rows, cols, mines) {
  const minesAround = countMinesAround(row, col, rows, cols);
  const flagAround = countFlagsAround(row, col, rows, cols);

  if (minesAround === flagAround) {
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const checkRow = row + r;
        const checkCol = col + c;

        if (isValidCell(checkRow, checkCol, rows, cols)) {
          if (!cells[checkRow][checkCol].opened) {
            openCell(checkRow, checkCol, rows, cols, mines);
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

function restartGame(level) {
  const cellsEl = document.querySelectorAll('.cell');
  cellsEl.forEach((cell) => (cell.className = 'cell'));

  initGame(level);
}

function checkWin(rows, cols, mines) {
  const cells = document.querySelectorAll('.is-opened');
  return cells.length + mines === rows * cols;
}

restartButton.addEventListener('click', () => restartGame(level));

levelSelect.addEventListener('change', (e) => {
  level = e.target.value;
  initGame(level);
});

initGame(level);
