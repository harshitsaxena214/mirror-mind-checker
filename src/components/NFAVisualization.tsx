import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface NFAVisualizationProps {
  input: string;
  currentStep: number;
  isAnimating: boolean;
}

type State = "q0" | "q1" | "q2" | "accept" | "reject";

export const NFAVisualization = ({
  input,
  currentStep,
  isAnimating,
}: NFAVisualizationProps) => {
  const inputArray = input.split("");
  const midpoint = Math.ceil(input.length / 2);
  
  // Calculate current state based on step
  const getCurrentState = (): State => {
    if (currentStep === 0) return "q0";
    if (currentStep <= input.length) return "q1";
    if (currentStep <= input.length * 2) return "q2";
    
    // Final state
    const isPalindrome = input === input.split("").reverse().join("");
    return isPalindrome ? "accept" : "reject";
  };

  const currentState = getCurrentState();
  
  // Calculate which character is being processed
  const processingIndex = currentStep <= input.length 
    ? currentStep - 1 
    : (input.length * 2 - currentStep);

  return (
    <Card className="p-8 space-y-8 animate-slide-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">NFA State Diagram</h2>
        <p className="text-sm text-muted-foreground">
          {isAnimating ? "Processing..." : "Current state visualization"}
        </p>
      </div>

      {/* State Diagram */}
      <div className="flex items-center justify-center gap-8 py-8">
        {/* q0 - Start State */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "w-24 h-24 rounded-full border-4 flex items-center justify-center font-bold text-lg transition-all duration-300",
              currentState === "q0"
                ? "border-primary bg-primary/10 scale-110 shadow-lg shadow-primary/20"
                : "border-muted bg-card"
            )}
          >
            q₀
          </div>
          <Badge variant="outline" className="font-mono text-xs">Start</Badge>
        </div>

        <ArrowRight className="w-8 h-8 text-muted-foreground" />

        {/* q1 - Reading Forward */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "w-24 h-24 rounded-full border-4 flex items-center justify-center font-bold text-lg transition-all duration-300",
              currentState === "q1"
                ? "border-primary bg-primary/10 scale-110 shadow-lg shadow-primary/20 animate-pulse-slow"
                : "border-muted bg-card"
            )}
          >
            q₁
          </div>
          <Badge variant="outline" className="font-mono text-xs">Push</Badge>
        </div>

        <ArrowRight className="w-8 h-8 text-muted-foreground" />

        {/* q2 - Reading Backward */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "w-24 h-24 rounded-full border-4 flex items-center justify-center font-bold text-lg transition-all duration-300",
              currentState === "q2"
                ? "border-accent bg-accent/10 scale-110 shadow-lg shadow-accent/20 animate-pulse-slow"
                : "border-muted bg-card"
            )}
          >
            q₂
          </div>
          <Badge variant="outline" className="font-mono text-xs">Pop & Compare</Badge>
        </div>

        <ArrowRight className="w-8 h-8 text-muted-foreground" />

        {/* Accept/Reject State */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "w-24 h-24 rounded-full border-4 flex items-center justify-center font-bold text-lg transition-all duration-300",
              currentState === "accept" || currentState === "reject"
                ? currentState === "accept"
                  ? "border-success bg-success/10 scale-110 shadow-lg shadow-success/20"
                  : "border-destructive bg-destructive/10 scale-110 shadow-lg shadow-destructive/20"
                : "border-muted bg-card border-dashed"
            )}
          >
            {currentState === "accept" ? "✓" : currentState === "reject" ? "✗" : "?"}
          </div>
          <Badge
            variant={
              currentState === "accept"
                ? "default"
                : currentState === "reject"
                ? "destructive"
                : "outline"
            }
            className="font-mono text-xs"
          >
            {currentState === "accept" || currentState === "reject"
              ? currentState === "accept"
                ? "Accept"
                : "Reject"
              : "Final"}
          </Badge>
        </div>
      </div>

      {/* String Visualization */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">String Processing</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {inputArray.map((char, index) => (
            <div
              key={index}
              className={cn(
                "w-14 h-14 rounded-lg border-2 flex items-center justify-center font-mono text-xl font-bold transition-all duration-300",
                processingIndex === index && isAnimating
                  ? "border-primary bg-primary/20 scale-110 shadow-lg"
                  : "border-border bg-card"
              )}
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* Stack Visualization (for educational purposes) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Stack (Conceptual)</h3>
        <div className="flex flex-col-reverse items-center gap-2 min-h-[100px] justify-end">
          {currentState === "q1" &&
            inputArray.slice(0, Math.min(currentStep, midpoint)).map((char, index) => (
              <div
                key={index}
                className="w-20 h-12 rounded-lg border-2 border-primary bg-primary/10 flex items-center justify-center font-mono text-lg font-bold animate-slide-in"
              >
                {char}
              </div>
            ))}
          {currentState === "q2" &&
            inputArray
              .slice(0, midpoint)
              .reverse()
              .slice(currentStep - input.length)
              .reverse()
              .map((char, index) => (
                <div
                  key={index}
                  className="w-20 h-12 rounded-lg border-2 border-accent bg-accent/10 flex items-center justify-center font-mono text-lg font-bold"
                >
                  {char}
                </div>
              ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {currentState === "q1" && "Pushing characters..."}
          {currentState === "q2" && "Popping and comparing..."}
          {(currentState === "accept" || currentState === "reject") && "Stack empty"}
        </p>
      </div>
    </Card>
  );
};
