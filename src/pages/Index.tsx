import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BingoGrid } from "@/components/BingoGrid";
import { AnswerDialog } from "@/components/AnswerDialog";
import { GameSummary } from "@/components/GameSummary";
import { VerbListDialog } from "@/components/VerbListDialog";
import { defaultVerbs, getRandomVerbs, getVerbsByDifficulty, Verb, DifficultyLevel } from "@/data/verbs";
import { checkBingoWin, getWinningLines } from "@/lib/bingo-utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

interface CellState {
  attempted: boolean;
  correct: boolean;
  attempts: number;
}

const Index = () => {
  const [customVerbs, setCustomVerbs] = useState<Verb[]>(defaultVerbs);
  const [gameVerbs, setGameVerbs] = useState<Verb[]>([]);
  const [cellStates, setCellStates] = useState<CellState[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ index: number; verb: Verb } | null>(null);
  const [answerResult, setAnswerResult] = useState<{ correct: boolean; interpreted: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showVerbList, setShowVerbList] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [completedLinesCount, setCompletedLinesCount] = useState(0);
  const [pendingCelebration, setPendingCelebration] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);

  const playLineCompletionSound = (lineNumber: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if (lineNumber === 3) {
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
    } else {
      // Simple pleasant tone for lines 1 and 2
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const frequencies = [523.25, 659.25]; // C5, E5
      oscillator.frequency.value = frequencies[lineNumber - 1];
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  const initializeGame = (difficultyLevel?: DifficultyLevel) => {
    const level = difficultyLevel ?? difficulty;
    const verbs = getVerbsByDifficulty(level, customVerbs);
    setGameVerbs(verbs);
    setCellStates(verbs.map(() => ({ attempted: false, correct: false, attempts: 0 })));
    setSelectedCell(null);
    setAnswerResult(null);
    setShowSummary(false);
    setHasWon(false);
    setCompletedLinesCount(0);
    setPendingCelebration(null);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const correctCells = cellStates.map(s => s.correct);
    const winningLines = getWinningLines(correctCells);
    const currentLinesCount = winningLines.length;

    // Check if new lines were completed
    if (currentLinesCount > completedLinesCount) {
      // Store pending celebration to trigger after modal closes
      setPendingCelebration(currentLinesCount);
      setCompletedLinesCount(currentLinesCount);
    }

    // Check for win (3+ lines)
    const won = checkBingoWin(correctCells);
    if (won && !hasWon) {
      setHasWon(true);
      setTimeout(() => {
        setShowSummary(true);
      }, 1000);
    }
  }, [cellStates, hasWon, completedLinesCount]);

  const handleCellClick = (index: number, verb: Verb) => {
    setSelectedCell({ index, verb });
    setAnswerResult(null);
  };

  const handleSubmitAnswer = async (imageData: string) => {
    if (!selectedCell) return;

    setIsSubmitting(true);

    try {
      const correctAnswer = gameVerbs[selectedCell.index].past;

      // Call the handwriting recognition edge function
      const { data, error } = await supabase.functions.invoke('recognize-handwriting', {
        body: { imageData }
      });

      if (error) {
        console.error('Error calling handwriting recognition:', error);
        if (error.message.includes('Rate limit')) {
          toast.error("Too many attempts! Please wait a moment.");
        } else if (error.message.includes('usage limit')) {
          toast.error("AI usage limit reached. Please contact your teacher.");
        } else {
          toast.error("Failed to check your answer. Please try again.");
        }
        return;
      }

      const interpretedText = data?.text?.toLowerCase().trim() || '';
      console.log('AI interpreted:', interpretedText, 'Expected:', correctAnswer);

      const isCorrect = interpretedText === correctAnswer.toLowerCase();

      setAnswerResult({
        correct: isCorrect,
        interpreted: interpretedText || 'Unable to read',
      });

      // Update cell state
      const newStates = [...cellStates];
      newStates[selectedCell.index] = {
        attempted: true,
        correct: isCorrect || newStates[selectedCell.index].correct,
        attempts: newStates[selectedCell.index].attempts + 1,
      };
      setCellStates(newStates);

      if (isCorrect) {
        toast.success("Correct! Great job!");
      }
    } catch (error) {
      console.error("Error checking answer:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswerResult(null);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedCell(null);
      setAnswerResult(null);
      
      // Trigger pending celebration after modal closes
      if (pendingCelebration !== null) {
        const lineNumber = pendingCelebration;
        
        // Show toast message
        if (lineNumber < 3) {
          const messages = [
            "🎉 Amazing! You completed a line!",
            "🌟 Fantastic! That's 2 lines!",
          ];
          toast.success(messages[lineNumber - 1], {
            duration: 3000,
          });
          
          // Confetti for first and second line
          confetti({
            particleCount: lineNumber === 1 ? 50 : 100,
            spread: lineNumber === 1 ? 60 : 90,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FF69B4', '#87CEEB', '#98D8C8']
          });
          
          // Play sound
          playLineCompletionSound(lineNumber);
        } else {
          // Win celebration
          toast.success("🎊 INCREDIBLE! You completed 3 lines and won!", {
            duration: 5000,
          });
          
          // Big celebration confetti for winning
          const duration = 3000;
          const end = Date.now() + duration;
          
          const frame = () => {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#FFD700', '#FF69B4', '#87CEEB', '#98D8C8', '#F97316']
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#FFD700', '#FF69B4', '#87CEEB', '#98D8C8', '#F97316']
            });
            
            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();
          
          // Don't play sound here - it will play when GameSummary modal opens
        }
        
        setPendingCelebration(null);
      }
    }
  };

  const handleEndGame = () => {
    setShowSummary(true);
  };

  const handleRestartGame = () => {
    initializeGame();
  };

  const handleSaveVerbs = (verbs: Verb[]) => {
    setCustomVerbs(verbs);
    initializeGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4 sm:p-8 relative">
      {/* Settings Button - Top Right Corner */}
      <Button
        onClick={() => setShowVerbList(true)}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 shadow-card"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Verb Tense Bingo
          </h1>
          <p className="text-lg text-muted-foreground">
            Find the past tense and complete 3 lines to win!
          </p>
        </div>

        {/* Compact Controls Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Difficulty Selector */}
          <div className="inline-flex gap-1 p-1 bg-card rounded-lg shadow-card border border-border">
            {([1, 2, 3] as DifficultyLevel[]).map((level) => (
              <Button
                key={level}
                onClick={() => {
                  setDifficulty(level);
                  initializeGame(level);
                }}
                variant={difficulty === level ? "default" : "ghost"}
                size="sm"
                className={difficulty === level ? "bg-gradient-primary" : ""}
              >
                Lv {level}
              </Button>
            ))}
          </div>
          
          <div className="h-6 w-px bg-border hidden sm:block" />
          
          <Button
            onClick={handleRestartGame}
            size="sm"
            className="bg-gradient-primary shadow-playful"
          >
            New Game
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleEndGame}
                  variant="ghost"
                  size="sm"
                >
                  🏁
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>End Game</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Game Grid */}
        {gameVerbs.length > 0 && (
          <BingoGrid
            verbs={gameVerbs}
            onCellClick={handleCellClick}
            cellStates={cellStates}
            completedLinesCount={completedLinesCount}
          />
        )}

        {/* Answer Dialog */}
        <AnswerDialog
          open={selectedCell !== null}
          onOpenChange={handleDialogClose}
          verb={selectedCell?.verb.present || ""}
          onSubmit={handleSubmitAnswer}
          isSubmitting={isSubmitting}
          result={answerResult}
          onRetry={handleRetry}
        />

        {/* Game Summary Dialog */}
        <GameSummary
          open={showSummary}
          onOpenChange={setShowSummary}
          verbs={gameVerbs}
          cellStates={cellStates}
          onRestart={handleRestartGame}
          hasWon={hasWon}
        />

        {/* Verb List Customization Dialog */}
        <VerbListDialog
          open={showVerbList}
          onOpenChange={setShowVerbList}
          verbs={customVerbs}
          onSave={handleSaveVerbs}
        />
      </div>
    </div>
  );
};

export default Index;
