import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Trophy } from "lucide-react";
import { BingoGrid } from "@/components/BingoGrid";
import { AnswerDialog } from "@/components/AnswerDialog";
import { GameSummary } from "@/components/GameSummary";
import { VerbListDialog } from "@/components/VerbListDialog";
import { defaultVerbs, getRandomVerbs, Verb } from "@/data/verbs";
import { checkBingoWin, getWinningLines } from "@/lib/bingo-utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const initializeGame = () => {
    const verbs = getRandomVerbs(25, customVerbs);
    setGameVerbs(verbs);
    setCellStates(verbs.map(() => ({ attempted: false, correct: false, attempts: 0 })));
    setSelectedCell(null);
    setAnswerResult(null);
    setShowSummary(false);
    setHasWon(false);
    setCompletedLinesCount(0);
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
      const newLinesCompleted = currentLinesCount - completedLinesCount;
      
      // Show celebration for each new line
      if (currentLinesCount < 3) {
        const messages = [
          "🎉 Amazing! You completed a line!",
          "🌟 Fantastic! That's 2 lines!",
        ];
        toast.success(messages[currentLinesCount - 1], {
          duration: 3000,
        });
      }
      
      setCompletedLinesCount(currentLinesCount);
    }

    // Check for win (3+ lines)
    const won = checkBingoWin(correctCells);
    if (won && !hasWon) {
      setHasWon(true);
      setTimeout(() => {
        toast.success("🎊 INCREDIBLE! You completed 3 lines and won!", {
          duration: 5000,
        });
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Verb Tense Bingo
          </h1>
          <p className="text-xl text-muted-foreground">
            Find the past tense and complete 3 lines to win!
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center flex-wrap">
          <Button
            onClick={() => setShowVerbList(true)}
            variant="outline"
            size="lg"
            className="shadow-card"
          >
            <Settings className="mr-2 h-5 w-5" />
            Customize Words
          </Button>
          <Button
            onClick={handleEndGame}
            variant="outline"
            size="lg"
            className="shadow-card"
          >
            <Trophy className="mr-2 h-5 w-5" />
            End Game
          </Button>
          <Button
            onClick={handleRestartGame}
            size="lg"
            className="bg-gradient-primary shadow-playful"
          >
            New Game
          </Button>
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
