import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import TypingInput from './TypingInput';

// Sample text passages for the typing test
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once, making it perfect for typing practice.",
  "In the heart of every challenge lies an opportunity to grow. Success is not measured by the absence of failure, but by the courage to keep moving forward despite setbacks.",
  "Technology has revolutionized the way we communicate, work, and learn. From smartphones to artificial intelligence, innovation continues to shape our daily lives in remarkable ways.",
  "Reading is to the mind what exercise is to the body. It strengthens our imagination, expands our vocabulary, and opens doors to countless worlds of knowledge and wonder.",
  "The art of cooking combines creativity with science. A pinch of salt, a dash of spice, and a generous helping of love can transform simple ingredients into extraordinary meals."
];

// Validation function for text passages
const validateTextPassage = (text) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Text passage must be a non-empty string' };
  }
  
  if (text.trim().length < 50) {
    return { isValid: false, error: 'Text passage must be at least 50 characters long' };
  }
  
  if (text.length > 500) {
    return { isValid: false, error: 'Text passage must be less than 500 characters long' };
  }
  
  return { isValid: true, error: null };
};

// Pre-validate texts for performance
const validTexts = sampleTexts.filter(text => validateTextPassage(text).isValid);

// Get a random valid text passage
const getRandomText = () => {
  if (validTexts.length === 0) {
    return { text: "Error loading text passages. Please refresh the page.", error: "No valid text passages available" };
  }
  
  const randomIndex = Math.floor(Math.random() * validTexts.length);
  return { text: validTexts[randomIndex], error: null };
};

const TypingTest = () => {
  const [currentText, setCurrentText] = useState('');
  const [error, setError] = useState(null);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [typingProgress, setTypingProgress] = useState(null);

  // Select a random text passage when component loads
  useEffect(() => {
    const { text, error } = getRandomText();
    setCurrentText(text);
    setError(error);
  }, []);

  const handleNewText = useCallback(() => {
    const { text, error } = getRandomText();
    setCurrentText(text);
    setError(error);
    setIsTypingActive(false);
    setTypingProgress(null);
  }, []);

  const handleTypingProgress = useCallback((progress) => {
    setTypingProgress(progress);
    if (!isTypingActive && progress.charactersTyped > 0) {
      setIsTypingActive(true);
    }
  }, [isTypingActive]);

  const handleTypingComplete = useCallback((result) => {
    setIsTypingActive(false);
    console.log('Typing completed:', result);
    // TODO: Add completion handling (save result, show stats, etc.)
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Typing Speed Test
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Test your typing speed and accuracy
        </p>
      </header>

      {/* Text Display Card */}
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-center text-lg sm:text-xl">Type the following text:</CardTitle>
          <CardDescription className="text-center text-sm sm:text-base text-gray-600">
            Focus on accuracy and speed as you type the passage below
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50" role="alert" aria-live="polite">
              <CardContent className="pt-4 sm:pt-6">
                <p className="text-red-700 font-medium text-sm sm:text-base">⚠️ Error: {error}</p>
              </CardContent>
            </Card>
          )}

          {/* Typing Input Area */}
          <TypingInput 
            targetText={currentText}
            onComplete={handleTypingComplete}
            onProgressUpdate={handleTypingProgress}
          />
        </CardContent>
      </Card>

      {/* New Text Button and Progress Info */}
      <div className="text-center space-y-4">
        {typingProgress && (
          <div className="text-sm text-gray-600">
            <div className="flex justify-center gap-4">
              <span>Progress: {Math.round((typingProgress.charactersTyped / typingProgress.totalCharacters) * 100)}%</span>
              {typingProgress.charactersTyped > 0 && (
                <span>Characters: {typingProgress.charactersTyped}/{typingProgress.totalCharacters}</span>
              )}
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleNewText} 
          size="lg" 
          className="gap-2 w-full sm:w-auto"
          aria-label="Generate a new text passage for typing practice"
          disabled={isTypingActive}
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm sm:text-base">
            {isTypingActive ? 'Finish typing to get new text' : 'Get New Text'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default TypingTest;