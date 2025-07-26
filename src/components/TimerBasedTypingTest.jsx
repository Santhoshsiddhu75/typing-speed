import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Timer, Zap, Target, TrendingUp } from 'lucide-react';
import useTypingMetrics from '../hooks/useTypingMetrics';
import wordGenerator from '../utils/WordGenerator';
import TextHighlighter from './TextHighlighter';
import TestResults from './TestResults';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TimerBasedTypingTest = ({ duration, difficulty, onBack, onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [targetText, setTargetText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [wordsTyped, setWordsTyped] = useState(0);
  const [finalResults, setFinalResults] = useState(null);
  const [isLoadingText, setIsLoadingText] = useState(true);
  
  const timerRef = useRef(null);
  const wordsContainerRef = useRef(null);
  
  const { stats, startTest, updateProgress, endTest, reset } = useTypingMetrics();

  // Initialize passage text when component mounts
  useEffect(() => {
    const initializeText = async () => {
      setIsLoadingText(true);
      try {
        const initialText = await wordGenerator.initializePassageTest(difficulty, duration, true);
        setTargetText(initialText);
        // Preload additional passages for better performance
        wordGenerator.preloadPassages(difficulty);
      } catch (error) {
        console.warn('Failed to initialize passage text, using word generation:', error);
        wordGenerator.initializeTest(difficulty, 300);
        const fallbackText = wordGenerator.getWordsAsText(Math.ceil((duration / 60) * 40 * 1.5));
        setTargetText(fallbackText);
      } finally {
        setIsLoadingText(false);
      }
    };
    
    initializeText();
  }, [difficulty, duration]);

  // Timer countdown effect
  useEffect(() => {
    if (isTestActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTestActive, timeRemaining]);

  // Auto-focus text container when test becomes active
  useEffect(() => {
    if (isTestActive && wordsContainerRef.current) {
      wordsContainerRef.current.focus();
    }
  }, [isTestActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTestComplete = useCallback(() => {
    setIsTestActive(false);
    setIsTestComplete(true);
    
    // Get current stats before ending the test (to avoid 0 WPM issue)
    const currentStats = {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      charactersTyped: stats.charactersTyped,
      timeElapsed: stats.timeElapsed
    };
    
    // Store final results for display
    const results = {
      ...currentStats,
      duration: duration - timeRemaining,
      difficulty,
      wordsTyped,
      testType: 'timer-based'
    };
    
    setFinalResults(results);
    
    // End the test after capturing stats
    endTest();
    
    if (onComplete) {
      onComplete(results);
    }
  }, [stats, endTest, onComplete, duration, timeRemaining, wordsTyped, difficulty]);

  const startTypingTest = () => {
    // Don't start if text is still loading
    if (isLoadingText || !targetText) {
      return;
    }
    
    setIsTestActive(true);
    setIsTestComplete(false);
    setUserInput('');
    setWordsTyped(0);
    startTest();
    
    if (wordsContainerRef.current) {
      wordsContainerRef.current.focus();
    }
  };

  const resetTest = () => {
    setIsTestActive(false);
    setIsTestComplete(false);
    setTimeRemaining(duration);
    setUserInput('');
    setWordsTyped(0);
    setFinalResults(null);
    reset();
    
    // Generate new passage text with proper duration
    const generateNewText = async () => {
      setIsLoadingText(true);
      try {
        const newText = await wordGenerator.initializePassageTest(difficulty, duration, true);
        setTargetText(newText);
      } catch (error) {
        console.warn('Failed to reset with passage text, using words:', error);
        wordGenerator.initializeTest(difficulty, 300);
        const fallbackText = wordGenerator.getWordsAsText(Math.ceil((duration / 60) * 40 * 1.5));
        setTargetText(fallbackText);
      } finally {
        setIsLoadingText(false);
      }
    };
    
    generateNewText();
  };

  const handleKeyPress = (e) => {
    if (!isTestActive || isTestComplete) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValue = userInput.slice(0, -1);
      setUserInput(newValue);
      updateTypingState(newValue);
      return;
    }

    // Handle regular characters and space
    if (e.key.length === 1) {
      e.preventDefault();
      const newValue = userInput + e.key;
      setUserInput(newValue);
      updateTypingState(newValue);
    }
  };

  const updateTypingState = (value) => {
    // Count completed words (words followed by space)
    const completedWords = value.split(' ').filter(word => word !== '').length;
    if (value.endsWith(' ')) {
      setWordsTyped(completedWords);
    } else {
      setWordsTyped(Math.max(0, completedWords - 1));
    }

    // Update typing metrics (no more dynamic text addition)
    updateProgress(value, targetText);
  };


  if (isTestComplete && finalResults) {
    return (
      <TestResults
        results={finalResults}
        onRetry={resetTest}
        onNewTest={onBack}
        previousBest={null} // TODO: Implement personal records in Phase 3
        showPersonalRecords={false} // TODO: Enable when user authentication is added
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex flex-col">
      {/* Header Section */}
      <div className="w-full bg-card/30 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Setup
            </Button>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground capitalize mb-1">
                {difficulty} • {duration / 60} min test
              </div>
            </div>
            
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          
          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Timer Card */}
            <Card className="bg-card/60 backdrop-blur-md border-primary/20 shadow-large animate-pulse-soft">
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <div className={cn(
                    "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r transition-all duration-500",
                    timeRemaining <= 10 
                      ? "from-red-500 to-red-600 animate-pulse" 
                      : "from-primary to-chart-1"
                  )}>
                    <Timer className="w-8 h-8 text-white" />
                  </div>
                  <div className={cn(
                    "text-3xl font-bold mb-2 transition-colors duration-300",
                    timeRemaining <= 10 ? "text-red-600" : "text-foreground"
                  )}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </div>
              </CardContent>
            </Card>

            {/* WPM Card */}
            <Card className="bg-card/60 backdrop-blur-md border-chart-1/20 shadow-large">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-chart-1 to-emerald-500 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2 animate-scale-in">
                  {stats.wpm}
                </div>
                <div className="text-sm text-muted-foreground">Words/Min</div>
              </CardContent>
            </Card>

            {/* Accuracy Card */}
            <Card className="bg-card/60 backdrop-blur-md border-chart-2/20 shadow-large">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-chart-2 to-purple-500 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2 animate-scale-in">
                  {stats.accuracy}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="bg-card/60 backdrop-blur-md border-chart-3/20 shadow-large">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-chart-3 to-orange-500 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2 animate-scale-in">
                  {wordsTyped}
                </div>
                <div className="text-sm text-muted-foreground">Words</div>
              </CardContent>
            </Card>
          </div>

          {/* Typing Area */}
          <Card className="bg-card/40 backdrop-blur-lg border-primary/30 shadow-large min-h-[400px] animate-fade-in">
            <CardContent className="p-8">
              <div 
                ref={wordsContainerRef}
                className="min-h-[300px] focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg transition-all duration-300"
                tabIndex={0}
                onKeyDown={handleKeyPress}
              >
                {!isTestActive ? (
                  <div className="flex items-center justify-center h-[300px] text-center">
                    {isLoadingText ? (
                      <div className="animate-fade-in">
                        <div className="w-16 h-16 mx-auto mb-6">
                          <div className="w-full h-full rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                        </div>
                        <p className="text-lg text-muted-foreground mb-2">Preparing your typing challenge</p>
                        <p className="text-sm text-muted-foreground">Loading optimized text passage...</p>
                      </div>
                    ) : (
                      <div className="animate-slide-up">
                        <h3 className="text-2xl font-semibold text-foreground mb-4">Ready to Start?</h3>
                        <p className="text-muted-foreground mb-8 max-w-md">
                          Focus on accuracy first, then speed. Good luck with your typing challenge!
                        </p>
                        <Button
                          onClick={startTypingTest}
                          disabled={isLoadingText || !targetText}
                          size="lg"
                          className="bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold px-12 py-4 rounded-xl shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105"
                        >
                          <Timer className="w-5 h-5 mr-2" />
                          Start Test
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <TextHighlighter 
                      targetText={targetText} 
                      userInput={userInput}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Live Progress Bar */}
          {isTestActive && (
            <div className="mt-6 animate-slide-up">
              <Card className="bg-card/40 backdrop-blur-md border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{stats.charactersTyped} characters typed</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-chart-1 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(100, (userInput.length / targetText.length) * 100)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TimerBasedTypingTest;