import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw } from "lucide-react";
import { Verb } from "@/data/verbs";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface GameSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verbs: Verb[];
  cellStates: Array<{ attempted: boolean; correct: boolean; attempts: number }>;
  onRestart: () => void;
  hasWon: boolean;
}

export const GameSummary = ({
  open,
  onOpenChange,
  verbs,
  cellStates,
  onRestart,
  hasWon,
}: GameSummaryProps) => {
  const correctCount = cellStates.filter(s => s.correct).length;
  const attemptedCount = cellStates.filter(s => s.attempted).length;
  const totalAttempts = cellStates.reduce((sum, s) => sum + s.attempts, 0);

  // Play win sound when modal opens if the player has won
  useEffect(() => {
    if (open && hasWon) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Special win sound - ascending chord
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        const startTime = audioContext.currentTime + (index * 0.1);
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.4);
      });
    }
  }, [open, hasWon]);

  return (
    <Dialog open={open} onOpenChange={(open) => open && onOpenChange(open)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center space-y-2">
            {hasWon && <Trophy className="w-16 h-16 text-warning mx-auto animate-bounce-subtle" />}
            <div className="text-4xl font-bold">
              {hasWon ? "Congratulations! 🎉" : "Game Summary"}
            </div>
          </DialogTitle>
          <DialogDescription className="text-center">
            View your game results and statistics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-success/10 rounded-xl border-2 border-success">
              <div className="text-3xl font-bold text-success">{correctCount}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="p-4 bg-destructive/10 rounded-xl border-2 border-destructive">
              <div className="text-3xl font-bold text-destructive">
                {attemptedCount - correctCount}
              </div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="p-4 bg-muted rounded-xl border-2 border-border">
              <div className="text-3xl font-bold text-foreground">{totalAttempts}</div>
              <div className="text-sm text-muted-foreground">Total Attempts</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-lg">Answer Grid</h3>
            <div className="grid grid-cols-5 gap-2 p-4 bg-card rounded-xl border-2 border-border">
              {verbs.map((verb, index) => {
                const state = cellStates[index];
                return (
                  <div
                    key={index}
                    className={cn(
                      "aspect-square rounded-lg p-2 flex flex-col items-center justify-center text-center border-2",
                      state.correct
                        ? "bg-success border-success text-success-foreground"
                        : state.attempted
                        ? "bg-destructive border-destructive text-destructive-foreground"
                        : "bg-unattempted border-unattempted text-unattempted-foreground"
                    )}
                  >
                    <div className="text-xs font-bold mb-1">{verb.present}</div>
                    <div className="text-lg font-bold">{verb.past}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-success border border-success"></div>
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-destructive border border-destructive"></div>
                <span>Incorrect</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-unattempted border border-unattempted"></div>
                <span>Not attempted</span>
              </div>
            </div>
          </div>

          <Button
            onClick={onRestart}
            size="lg"
            className="w-full bg-gradient-primary text-lg"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
