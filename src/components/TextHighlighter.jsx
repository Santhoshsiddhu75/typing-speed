import { useMemo } from 'react';
import { cn } from '@/lib/utils';

const TextHighlighter = ({ targetText, userInput }) => {
  const analysis = useMemo(() => {
    const words = targetText.split(' ');
    const userWords = userInput.split(' ');
    const currentWordIndex = userWords.length - 1;
    const currentPartialWord = userWords[currentWordIndex] || '';
    
    // Check if user just finished a word (input ends with space)
    const justFinishedWord = userInput.endsWith(' ') && userInput.trim() !== '';
    
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
        if (currentPartialWord === '' && justFinishedWord) {
          // Just finished previous word, show cursor at start of next word
          return {
            text: word,
            status: 'neutral',
            isComplete: false,
            showCursorAtStart: true
          };
        } else if (currentPartialWord === '' && !justFinishedWord) {
          // Starting the first word or beginning of typing
          return {
            text: word,
            status: 'neutral',
            isComplete: false,
            showCursorAtStart: true
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
          // Word doesn't match what user typed - show character-level errors
          return {
            text: word,
            status: 'character-error',
            isComplete: false,
            typedPart: currentPartialWord,
            remainingPart: word.slice(currentPartialWord.length)
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

  const getWordClasses = (status) => {
    switch (status) {
      case 'correct':
        return 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 transition-all duration-200';
      case 'incorrect':
        return 'text-red-500 bg-red-50/50 dark:bg-red-950/30 transition-all duration-200';
      case 'in-progress':
        return 'text-primary bg-primary/10 dark:bg-primary/20 transition-all duration-200';
      default:
        return 'text-muted-foreground transition-all duration-200 hover:text-foreground/80';
    }
  };

  const renderCharacterErrors = (typedText, targetWord) => {
    const chars = [];
    for (let i = 0; i < typedText.length; i++) {
      const typedChar = typedText[i];
      const targetChar = targetWord[i];
      const isCorrect = typedChar === targetChar;
      
      chars.push(
        <span 
          key={i} 
          className={cn(
            'font-semibold px-0.5 rounded-sm transition-all duration-150',
            isCorrect 
              ? 'text-emerald-500 bg-emerald-100/60 dark:bg-emerald-900/40' 
              : 'text-red-500 bg-red-100/60 dark:bg-red-900/40 animate-pulse'
          )}
        >
          {typedChar}
        </span>
      );
    }
    return chars;
  };

  const shouldShowCursorAfter = (wordAnalysis, index) => {
    // Don't show cursor after word if the next word already has showCursorAtStart
    const nextWord = analysis[index + 1];
    if (nextWord && nextWord.showCursorAtStart) {
      return false;
    }
    
    // Show cursor after the word if we just finished typing it correctly
    if (wordAnalysis.status === 'correct' && index === analysis.findIndex(w => w.status === 'neutral') - 1) {
      return true;
    }
    return false;
  };

  return (
    <div className="text-xl leading-relaxed font-mono select-none p-6 rounded-xl bg-gradient-to-br from-background/50 to-muted/30 backdrop-blur-sm border border-border/30" style={{ minHeight: '16rem', lineHeight: '1.6' }}>
      <div className="flex flex-wrap gap-x-1 gap-y-2">
        {analysis.map((wordAnalysis, index) => (
          <span key={index} className="inline-flex items-center">
            {wordAnalysis.showCursorAtStart && (
              <span 
                data-testid="typing-cursor"
                className="inline-block w-0.5 h-6 bg-primary mr-0.5 animate-pulse rounded-full shadow-sm"
              />
            )}
            <span className={cn(
              'px-1 py-0.5 rounded-md font-medium transition-all duration-300 hover:scale-[1.02]',
              getWordClasses(wordAnalysis.status)
            )}>
              {wordAnalysis.status === 'in-progress' ? (
                <>
                  <span className="text-emerald-500 font-semibold bg-emerald-100/40 dark:bg-emerald-900/30 px-0.5 rounded-sm">
                    {wordAnalysis.typedPart}
                  </span>
                  <span 
                    data-testid="typing-cursor"
                    className="inline-block w-0.5 h-6 bg-primary mx-0.5 animate-pulse rounded-full shadow-glow"
                  />
                  <span className="text-muted-foreground/70">{wordAnalysis.remainingPart}</span>
                </>
              ) : wordAnalysis.status === 'character-error' ? (
                <>
                  {renderCharacterErrors(wordAnalysis.typedPart, wordAnalysis.text)}
                  <span 
                    data-testid="typing-cursor"
                    className="inline-block w-0.5 h-6 bg-red-500 mx-0.5 animate-pulse rounded-full shadow-sm"
                  />
                  <span className="text-muted-foreground/50">{wordAnalysis.remainingPart}</span>
                </>
              ) : (
                <span className={cn(
                  wordAnalysis.status === 'correct' && 'font-semibold shadow-sm',
                  wordAnalysis.status === 'incorrect' && 'font-semibold line-through decoration-2 decoration-red-500'
                )}>
                  {wordAnalysis.text}
                </span>
              )}
            </span>
            {shouldShowCursorAfter(wordAnalysis, index) && (
              <span 
                data-testid="typing-cursor"
                className="inline-block w-0.5 h-6 bg-primary ml-1 animate-pulse rounded-full shadow-sm"
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TextHighlighter;