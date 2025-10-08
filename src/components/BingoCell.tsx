import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BingoCellProps {
  verb: string;
  isCorrect: boolean;
  isAttempted: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const BingoCell = ({ verb, isCorrect, isAttempted, onClick, disabled }: BingoCellProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "aspect-square rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-300",
        "border-2 relative overflow-hidden",
        isCorrect
          ? "bg-success border-success text-success-foreground shadow-lg scale-105"
          : isAttempted
          ? "bg-destructive/10 border-destructive text-foreground hover:bg-destructive/20"
          : "bg-card border-border text-foreground hover:bg-accent hover:border-accent hover:scale-105 active:scale-95",
        disabled && !isCorrect && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="relative z-10 text-center px-2">{verb}</span>
      {isCorrect && (
        <CheckCircle2 className="absolute top-1 right-1 w-5 h-5 text-success-foreground animate-celebrate" />
      )}
    </button>
  );
};
