import '/style.css';

const boardSize = 9;
const rows = 9;
const cols = 9;
const minesCount = 10;
const board = document.querySelector('#board');

function renderBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', () => console.log(mines[row][col]));
      board.appendChild(cell);
    }
  }
}

renderBoard();

let mines = new Array(rows)
  .fill(null)
  .map(() => new Array(cols).fill(null).map(() => false));

console.log(mines);

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
}

setMines();
