import { Verb } from "@/data/verbs";
import { BingoCell } from "./BingoCell";
import { checkBingoWin } from "@/lib/bingo-utils";
import { Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BingoGridProps {
  verbs: Verb[];
  onCellClick: (index: number, verb: Verb) => void;
  cellStates: Array<{ attempted: boolean; correct: boolean; attempts: number }>;
  completedLinesCount: number;
}

export const BingoGrid = ({ verbs, onCellClick, cellStates, completedLinesCount }: BingoGridProps) => {
  const hasWon = checkBingoWin(cellStates.map(s => s.correct));

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Line Progress Indicator */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-card/50 rounded-lg border border-border/50 shadow-sm">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="text-base font-semibold text-foreground">
            {completedLinesCount} of 3 lines completed
          </span>
        </div>
      </div>

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
