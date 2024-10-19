import '/style.css';

const boardSize = 9;
const mines = 10;
const board = document.querySelector('#board');

function renderBoard() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
    }
  }
}

renderBoard();
