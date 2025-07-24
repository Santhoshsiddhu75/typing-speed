import { useState, useCallback, useRef, useEffect } from 'react';
import TextHighlighter from './TextHighlighter';

const TypingInput = ({ targetText, onComplete, onProgressUpdate }) => {
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const hiddenInputRef = useRef(null);

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
    
    // Call progress update callback if provided
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

    // Check if typing is complete
    if (value === targetText && onComplete) {
      onComplete({
        userInput: value,
        targetText,
        accuracy: 100, // Will be calculated properly later
        completedAt: new Date()
      });
    }
  }, [targetText, onComplete, onProgressUpdate]);

  // Auto-focus when component mounts
  useEffect(() => {
    handleFocus();
  }, [handleFocus]);

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
      <div 
        onClick={handleFocus}
        className={`p-6 rounded-lg border-2 cursor-text transition-colors duration-200 ${
          isActive 
            ? 'border-blue-500 bg-blue-50/30' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        role="textbox"
        aria-label="Type the displayed text here"
        tabIndex={0}
        onFocus={handleFocus}
      >
        <TextHighlighter targetText={targetText} userInput={userInput} />
        
        {/* Instructions */}
        {userInput === '' && (
          <div className="absolute top-2 right-2 text-sm text-gray-500">
            Click here and start typing
          </div>
        )}
      </div>
      
      {/* Status indicator */}
      <div className="mt-2 text-sm text-gray-600">
        Progress: {userInput.length} / {targetText.length} characters
        {userInput.length > 0 && (
          <span className="ml-4">
            Accuracy: {Math.round((userInput.split('').filter((char, i) => char === targetText[i]).length / userInput.length) * 100)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default TypingInput;