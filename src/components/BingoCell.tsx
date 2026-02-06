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
        "aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-base md:text-lg lg:text-xl font-bold transition-all duration-300",
        "border sm:border-2 relative overflow-hidden",
        isCorrect
          ? "bg-success border-success text-success-foreground shadow-lg scale-105"
          : isAttempted
          ? "bg-destructive/10 border-destructive text-foreground hover:bg-destructive/20"
          : "bg-card border-border text-foreground hover:bg-accent hover:border-accent hover:scale-105 active:scale-95",
        disabled && !isCorrect && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="relative z-10 text-center px-0.5 sm:px-1 md:px-2 break-words leading-tight">{verb}</span>
      {isCorrect && (
        <CheckCircle2 className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-success-foreground animate-celebrate" />
      )}
    </button>
  );
};
