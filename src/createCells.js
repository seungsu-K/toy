function createCell() {
  return { mine: false, opened: false, flagged: false };
}

export function createCells(rows, cols) {
  const cells = new Array(rows)
    .fill(null)
    .map(() => new Array(cols).fill(null).map(() => createCell()));

  return cells;
}
