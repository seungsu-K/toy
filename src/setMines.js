export function setMines(boardSize, cells, mines) {
  let count = 0;

  while (count < mines) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    if (!cells[row][col].mine) {
      cells[row][col].mine = true;
      count++;
    }
  }

  return cells;
}
