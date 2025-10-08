import { useState } from "react";
import { Verb } from "@/data/verbs";
import { BingoCell } from "./BingoCell";
import { checkBingoWin } from "@/lib/bingo-utils";

interface BingoGridProps {
  verbs: Verb[];
  onCellClick: (index: number, verb: Verb) => void;
  cellStates: Array<{ attempted: boolean; correct: boolean; attempts: number }>;
}

export const BingoGrid = ({ verbs, onCellClick, cellStates }: BingoGridProps) => {
  const hasWon = checkBingoWin(cellStates.map(s => s.correct));

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-5 gap-2 sm:gap-3 p-4 bg-card rounded-2xl shadow-card">
        {verbs.map((verb, index) => (
          <BingoCell
            key={index}
            verb={verb.present}
            isCorrect={cellStates[index].correct}
            isAttempted={cellStates[index].attempted}
            onClick={() => onCellClick(index, verb)}
            disabled={cellStates[index].correct || hasWon}
          />
        ))}
      </div>
    </div>
  );
};
