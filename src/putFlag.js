import { getCellNode } from '@/getCellNode';

export function putFlag(row, col, cells) {
  const cellEl = getCellNode(row, col);
  const cell = cells[row][col];

  if (cell.opened) return;

  cellEl.classList.toggle('is-flagged');
  cell.flagged = !cell.flagged;
}
