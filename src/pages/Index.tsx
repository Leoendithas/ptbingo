import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Trophy } from "lucide-react";
import { BingoGrid } from "@/components/BingoGrid";
import { AnswerDialog } from "@/components/AnswerDialog";
import { GameSummary } from "@/components/GameSummary";
import { VerbListDialog } from "@/components/VerbListDialog";
import { defaultVerbs, getRandomVerbs, Verb } from "@/data/verbs";
import { checkBingoWin } from "@/lib/bingo-utils";
import { toast } from "sonner";

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

  const initializeGame = () => {
    const verbs = getRandomVerbs(25, customVerbs);
    setGameVerbs(verbs);
    setCellStates(verbs.map(() => ({ attempted: false, correct: false, attempts: 0 })));
    setSelectedCell(null);
    setAnswerResult(null);
    setShowSummary(false);
    setHasWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const won = checkBingoWin(cellStates.map(s => s.correct));
    if (won && !hasWon) {
      setHasWon(true);
      setTimeout(() => {
        toast.success("Congratulations! You completed 3 lines!", {
          duration: 5000,
        });
        setShowSummary(true);
      }, 1000);
    }
  }, [cellStates, hasWon]);

  const handleCellClick = (index: number, verb: Verb) => {
    setSelectedCell({ index, verb });
    setAnswerResult(null);
  };

  const handleSubmitAnswer = async (imageData: string) => {
    if (!selectedCell) return;

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual AI handwriting recognition via Lovable Cloud
      // For now, simulate more realistic handwriting recognition
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const correctAnswer = gameVerbs[selectedCell.index].past;
      
      // Simulate realistic handwriting recognition with common mistakes
      const generatePlausibleMisreading = (correct: string): string => {
        const commonMistakes = [
          correct.slice(0, -1), // Missing last letter
          correct + "ed", // Added extra "ed"
          correct.replace(/e$/, ""), // Missing final e
          correct.replace(/d$/, "t"), // d/t confusion
          correct.slice(0, -2) + correct.slice(-1), // Missing second to last letter
        ];
        return commonMistakes[Math.floor(Math.random() * commonMistakes.length)];
      };
      
      // 70% chance of correct recognition, 30% chance of misreading
      const mockInterpretation = Math.random() > 0.3 
        ? correctAnswer
        : generatePlausibleMisreading(correctAnswer);
      
      const isCorrect = mockInterpretation.toLowerCase() === correctAnswer.toLowerCase();

      setAnswerResult({
        correct: isCorrect,
        interpreted: mockInterpretation,
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
