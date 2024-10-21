export function setBoard(board, level) {
  switch (level) {
    case '초급':
      level = 'beginner';
      break;

    case '중급':
      level = 'intermediate';
      break;

    case '고급':
      level = 'expert';
      break;
  }

  board.classList.remove('beginner', 'intermediate', 'expert');
  board.classList.add(level);
}
