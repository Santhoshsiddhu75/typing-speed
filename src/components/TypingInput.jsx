import { useState, useCallback, useRef, useEffect } from 'react';
import TextHighlighter from './TextHighlighter';
import useTypingMetrics from '../hooks/useTypingMetrics';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TypingInput = ({ targetText, onComplete, onProgressUpdate }) => {
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const hiddenInputRef = useRef(null);
  const hasStartedRef = useRef(false);
  
  // Initialize typing metrics hook
  const { 
    stats, 
    isActive: metricsActive, 
    startTest, 
    endTest, 
    updateProgress, 
    reset 
  } = useTypingMetrics();

  // Focus the hidden input when component mounts or when clicked
  const handleFocus = useCallback(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      setIsActive(true);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setUserInput(value);
    
    try {
      // Start test on first keystroke
      if (!hasStartedRef.current && value.length > 0) {
        startTest();
        hasStartedRef.current = true;
      }
      
      // Update typing metrics with current progress
      if (hasStartedRef.current) {
        updateProgress(value, targetText);
      }
      
      // Call progress update callback with enhanced metrics
      if (onProgressUpdate) {
        const progress = {
          userInput: value,
          targetText,
          charactersTyped: value.length,
          totalCharacters: targetText.length,
          isComplete: value === targetText,
          // Enhanced metrics from typing engine
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          completionPercentage: stats.completionPercentage,
          timeElapsed: stats.timeElapsed
        };
        onProgressUpdate(progress);
      }

      // Check if typing is complete
      if (value === targetText && onComplete) {
        try {
          const finalResults = endTest();
          onComplete({
            userInput: value,
            targetText,
            completedAt: new Date(),
            // Enhanced final results from metrics engine
            ...finalResults
          });
        } catch (error) {
          console.warn('Error ending typing test:', error);
          // Fallback to basic completion data
          onComplete({
            userInput: value,
            targetText,
            accuracy: stats.accuracy || 100,
            completedAt: new Date()
          });
        }
        hasStartedRef.current = false;
      }
    } catch (error) {
      console.warn('Error in typing metrics:', error);
      // Continue with basic functionality if metrics fail
      if (onProgressUpdate) {
        const progress = {
          userInput: value,
          targetText,
          charactersTyped: value.length,
          totalCharacters: targetText.length,
          isComplete: value === targetText
        };
        onProgressUpdate(progress);
      }
    }
  }, [targetText, onComplete, onProgressUpdate, startTest, updateProgress, endTest, stats]);

  // Auto-focus when component mounts
  useEffect(() => {
    handleFocus();
  }, [handleFocus]);

  // Cleanup on unmount or when targetText changes
  useEffect(() => {
    return () => {
      if (hasStartedRef.current) {
        reset();
        hasStartedRef.current = false;
      }
    };
  }, [reset]);

  // Reset when target text changes
  useEffect(() => {
    if (hasStartedRef.current) {
      reset();
      hasStartedRef.current = false;
    }
    setUserInput('');
  }, [targetText, reset]);

  return (
    <div className="relative">
      {/* Hidden input field for capturing keystrokes */}
      <input
        ref={hiddenInputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="absolute -top-96 left-0 opacity-0 pointer-events-none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      
      {/* Clickable text display area */}
      <Card 
        onClick={handleFocus}
        className={cn(
          "cursor-text transition-all duration-300 hover:shadow-medium backdrop-blur-sm",
          isActive 
            ? 'ring-2 ring-primary/30 border-primary/50 shadow-large bg-card/60' 
            : 'border-border/30 hover:border-border/60 bg-card/40'
        )}
        role="textbox"
        aria-label="Type the displayed text here"
        tabIndex={0}
        onFocus={handleFocus}
      >
        <CardContent className="p-0">
          <TextHighlighter targetText={targetText} userInput={userInput} />
          
          {/* Instructions */}
          {userInput === '' && (
            <div className="text-center p-6 animate-fade-in">
              <div className="text-muted-foreground/70 mb-2">
                Click here and start typing to begin your test
              </div>
              <div className="text-xs text-muted-foreground/50">
                Focus on accuracy first, then speed will follow
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Enhanced status indicator with real-time metrics */}
      {userInput.length > 0 && (
        <Card className="mt-4 bg-card/40 backdrop-blur-md border-border/20 animate-slide-up">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-3"></div>
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium text-foreground">{userInput.length} / {targetText.length}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                <span className="text-muted-foreground">Accuracy:</span>
                <span className="font-medium text-foreground">{stats.accuracy}%</span>
              </div>
              
              {stats.wpm > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chart-1"></div>
                  <span className="text-muted-foreground">WPM:</span>
                  <span className="font-medium text-foreground">{stats.wpm}</span>
                </div>
              )}
              
              {stats.timeElapsed > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium text-foreground">{Math.round(stats.timeElapsed / 1000)}s</span>
                </div>
              )}
            </div>
            
            {/* Progress bar for completion percentage */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Completion Progress</span>
                <span className="font-medium">{stats.completionPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-chart-1 h-2 rounded-full transition-all duration-500 ease-out shadow-sm" 
                  style={{ width: `${stats.completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TypingInput;