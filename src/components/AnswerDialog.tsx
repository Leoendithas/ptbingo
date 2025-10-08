import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HandwritingCanvas } from "./HandwritingCanvas";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";

interface AnswerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verb: string;
  onSubmit: (imageData: string) => void;
  isSubmitting: boolean;
  result: {
    correct: boolean;
    interpreted: string;
  } | null;
  onRetry: () => void;
}

export const AnswerDialog = ({
  open,
  onOpenChange,
  verb,
  onSubmit,
  isSubmitting,
  result,
  onRetry,
}: AnswerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            What is the past tense of
          </DialogTitle>
          <DialogDescription className="text-4xl font-bold text-center text-primary pt-2">
            {verb}?
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4 pt-4">
            <p className="text-center text-muted-foreground">
              Write or draw your answer below
            </p>
            <HandwritingCanvas
              onSubmit={onSubmit}
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            <div
              className={`p-6 rounded-xl text-center ${
                result.correct
                  ? "bg-success/10 border-2 border-success"
                  : "bg-destructive/10 border-2 border-destructive"
              }`}
            >
              {result.correct ? (
                <div className="space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-success mx-auto animate-celebrate" />
                  <p className="text-2xl font-bold text-success">Correct!</p>
                  <p className="text-lg text-foreground">
                    You wrote: <span className="font-bold">{result.interpreted}</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
                  <p className="text-2xl font-bold text-destructive">Try Again!</p>
                  <p className="text-lg text-foreground">
                    I read: <span className="font-bold">{result.interpreted}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {result.correct ? (
                <Button
                  onClick={() => onOpenChange(false)}
                  size="lg"
                  className="w-full bg-gradient-primary"
                >
                  Continue
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => onOpenChange(false)}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Try Another
                  </Button>
                  <Button onClick={onRetry} size="lg" className="flex-1 bg-gradient-primary">
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Retry
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
