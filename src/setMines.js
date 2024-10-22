export function setMines(rows, cols, cells, mines) {
  let count = 0;

  while (count < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!cells[row][col].mine) {
      cells[row][col].mine = true;
      count++;
    }
  }

  // return cells;
}
