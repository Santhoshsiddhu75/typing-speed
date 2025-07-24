import { useMemo } from 'react';

const TextHighlighter = ({ targetText, userInput }) => {
  const analysis = useMemo(() => {
    const words = targetText.split(' ');
    const userWords = userInput.split(' ');
    const currentWordIndex = userWords.length - 1;
    const currentPartialWord = userWords[currentWordIndex] || '';
    
    return words.map((word, index) => {
      if (index < currentWordIndex) {
        // Completed words - check if they match
        const userWord = userWords[index] || '';
        return {
          text: word,
          status: userWord === word ? 'correct' : 'incorrect',
          isComplete: true
        };
      } else if (index === currentWordIndex) {
        // Current word being typed
        if (currentPartialWord === '') {
          return {
            text: word,
            status: 'neutral',
            isComplete: false,
            showCursor: true
          };
        } else if (word.startsWith(currentPartialWord)) {
          return {
            text: word,
            status: 'in-progress',
            isComplete: false,
            typedPart: currentPartialWord,
            remainingPart: word.slice(currentPartialWord.length)
          };
        } else {
          return {
            text: word,
            status: 'incorrect',
            isComplete: false,
            typedPart: currentPartialWord
          };
        }
      } else {
        // Untyped words
        return {
          text: word,
          status: 'neutral',
          isComplete: false
        };
      }
    });
  }, [targetText, userInput]);

  const getWordClassName = (status) => {
    switch (status) {
      case 'correct':
        return 'text-green-600 bg-green-50';
      case 'incorrect':
        return 'text-red-600 bg-red-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-700';
    }
  };

  const shouldShowCursorAfter = (wordAnalysis, index) => {
    // Show cursor after the word if we just finished typing it correctly
    if (wordAnalysis.status === 'correct' && index === analysis.findIndex(w => w.status === 'neutral') - 1) {
      return true;
    }
    return false;
  };

  return (
    <div className="text-lg leading-relaxed font-mono break-words select-none">
      {analysis.map((wordAnalysis, index) => (
        <span key={index} className="inline-block">
          <span className={`px-1 py-0.5 rounded transition-colors duration-200 ${getWordClassName(wordAnalysis.status)}`}>
            {wordAnalysis.status === 'in-progress' ? (
              <>
                <span className="text-green-600">{wordAnalysis.typedPart}</span>
                <span className="relative">
                  <span className="text-gray-700">{wordAnalysis.remainingPart}</span>
                  <span 
                    data-testid="typing-cursor"
                    className="absolute left-0 top-0 w-0.5 h-full bg-blue-500 animate-pulse"
                    style={{ left: `${wordAnalysis.typedPart.length * 0.6}em` }}
                  />
                </span>
              </>
            ) : (
              wordAnalysis.text
            )}
          </span>
          {shouldShowCursorAfter(wordAnalysis, index) && (
            <span 
              data-testid="typing-cursor"
              className="inline-block w-0.5 h-6 bg-blue-500 animate-pulse ml-1"
            />
          )}
          {index < analysis.length - 1 && ' '}
        </span>
      ))}
    </div>
  );
};

export default TextHighlighter;