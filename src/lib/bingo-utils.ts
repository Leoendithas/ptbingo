export function checkBingoWin(correctCells: boolean[]): boolean {
  // Check rows
  for (let i = 0; i < 5; i++) {
    const rowStart = i * 5;
    if (correctCells.slice(rowStart, rowStart + 5).every(cell => cell)) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < 5; i++) {
    if (
      correctCells[i] &&
      correctCells[i + 5] &&
      correctCells[i + 10] &&
      correctCells[i + 15] &&
      correctCells[i + 20]
    ) {
      return true;
    }
  }

  // Check diagonal (top-left to bottom-right)
  if (
    correctCells[0] &&
    correctCells[6] &&
    correctCells[12] &&
    correctCells[18] &&
    correctCells[24]
  ) {
    return true;
  }

  // Check diagonal (top-right to bottom-left)
  if (
    correctCells[4] &&
    correctCells[8] &&
    correctCells[12] &&
    correctCells[16] &&
    correctCells[20]
  ) {
    return true;
  }

  return false;
}

export function getWinningLines(correctCells: boolean[]): number[][] {
  const lines: number[][] = [];

  // Check rows
  for (let i = 0; i < 5; i++) {
    const rowStart = i * 5;
    const row = Array.from({ length: 5 }, (_, j) => rowStart + j);
    if (row.every(index => correctCells[index])) {
      lines.push(row);
    }
  }

  // Check columns
  for (let i = 0; i < 5; i++) {
    const col = Array.from({ length: 5 }, (_, j) => i + j * 5);
    if (col.every(index => correctCells[index])) {
      lines.push(col);
    }
  }

  // Check diagonals
  const diag1 = [0, 6, 12, 18, 24];
  if (diag1.every(index => correctCells[index])) {
    lines.push(diag1);
  }

  const diag2 = [4, 8, 12, 16, 20];
  if (diag2.every(index => correctCells[index])) {
    lines.push(diag2);
  }

  return lines;
}
