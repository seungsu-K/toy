export function isValidCell(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}
