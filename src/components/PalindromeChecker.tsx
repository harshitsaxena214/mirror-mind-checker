import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RotateCcw, Info } from "lucide-react";
import { NFAVisualization } from "./NFAVisualization";
import { cn } from "@/lib/utils";

const MAX_LENGTH = 7;

export const PalindromeChecker = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"accept" | "reject" | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const checkPalindrome = (str: string): boolean => {
    if (str.length === 0 || str.length > MAX_LENGTH) return false;
    return str === str.split("").reverse().join("");
  };

  const handleCheck = () => {
    if (input.length === 0) return;
    
    setIsAnimating(true);
    setCurrentStep(0);
    
    const isPalindrome = checkPalindrome(input);
    
    // Animate through steps
    const steps = input.length * 2 + 1;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      
      if (step >= steps) {
        clearInterval(interval);
        setResult(isPalindrome ? "accept" : "reject");
        setIsAnimating(false);
      }
    }, 500);
  };

  const handleReset = () => {
    setInput("");
    setResult(null);
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z]/g, "");
    if (value.length <= MAX_LENGTH) {
      setInput(value);
      setResult(null);
      setCurrentStep(0);
    }
  };

  useEffect(() => {
    if (input && !isAnimating) {
      const isPalindrome = checkPalindrome(input);
      setResult(isPalindrome ? "accept" : "reject");
    }
  }, [input, isAnimating]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-slide-in">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Palindrome Checker
        </h1>
        <p className="text-lg text-muted-foreground">
          NFA with Reversal - Accepts strings that read the same forwards and backwards
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-8 space-y-6 animate-slide-in">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Enter a string (a-z only, max {MAX_LENGTH} characters):</label>
            <Badge variant="outline" className="font-mono">
              {input.length}/{MAX_LENGTH}
            </Badge>
          </div>
          
          <div className="flex gap-4">
            <Input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="e.g., racecar, level, a"
              className={cn(
                "text-2xl font-mono text-center h-16 transition-all",
                result === "accept" && "border-success ring-success",
                result === "reject" && "border-destructive ring-destructive"
              )}
              disabled={isAnimating}
            />
            <Button
              onClick={handleCheck}
              disabled={!input || isAnimating}
              size="lg"
              className="px-8"
            >
              Check
            </Button>
            <Button
              onClick={handleReset}
              disabled={isAnimating}
              size="lg"
              variant="outline"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Result Display */}
          {result && !isAnimating && (
            <div
              className={cn(
                "flex items-center justify-center gap-3 p-6 rounded-lg transition-all animate-slide-in",
                result === "accept"
                  ? "bg-success/10 border border-success/30"
                  : "bg-destructive/10 border border-destructive/30"
              )}
            >
              {result === "accept" ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-success" />
                  <span className="text-2xl font-semibold text-success">
                    Accepted! "{input}" is a palindrome
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-destructive" />
                  <span className="text-2xl font-semibold text-destructive">
                    Rejected! "{input}" is not a palindrome
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* NFA Visualization */}
      {input && (
        <NFAVisualization
          input={input}
          currentStep={currentStep}
          isAnimating={isAnimating}
        />
      )}

      {/* Info Section */}
      <Card className="p-6 space-y-4 bg-card/50 backdrop-blur animate-slide-in">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">How NFA with Reversal Works</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A Non-deterministic Finite Automaton (NFA) with reversal checks palindromes by:
            </p>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside ml-4">
              <li>Reading the input string forward while pushing characters onto a stack</li>
              <li>Non-deterministically guessing the middle of the string</li>
              <li>Reading the rest of the input while comparing with popped stack characters</li>
              <li>Accepting if all characters match (palindrome) or rejecting otherwise</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Example:</strong> For "racecar", the NFA reads "race", guesses the middle 'c', 
              then verifies "car" matches the reversed "rac" from the stack.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
