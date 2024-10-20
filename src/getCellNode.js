export function getCellNode(row, col) {
  return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}
