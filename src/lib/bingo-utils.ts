export function checkBingoWin(correctCells: boolean[]): boolean {
  // Use getWinningLines to count completed lines
  const winningLines = getWinningLines(correctCells);
  // Win condition: 3 or more completed lines
  return winningLines.length >= 3;
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
