export function isValidCell(row, col, boardSize) {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}
