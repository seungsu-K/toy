export function setGame(level) {
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

  return setting[level];
}
