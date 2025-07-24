/**
 * Compares user input against target text character by character
 * @param {string} userInput - The text the user has typed
 * @param {string} targetText - The target text to compare against
 * @returns {Object} Comparison result with accuracy metrics
 */
export const compareTypingInput = (userInput, targetText) => {
  let correctChars = 0;
  let incorrectChars = 0;
  
  // Count correct characters from the beginning
  const minLength = Math.min(userInput.length, targetText.length);
  for (let i = 0; i < minLength; i++) {
    if (userInput[i] === targetText[i]) {
      correctChars++;
    } else {
      // Once we hit an incorrect character, everything after is incorrect
      incorrectChars = userInput.length - i;
      break;
    }
  }
  
  // If input is longer than target, extra characters are incorrect
  if (userInput.length > targetText.length) {
    incorrectChars = Math.max(incorrectChars, userInput.length - targetText.length);
  }
  
  // If we haven't found any incorrect chars yet but input is shorter, 
  // then all typed chars are correct
  if (incorrectChars === 0 && correctChars < userInput.length) {
    correctChars = userInput.length;
  }
  
  const isComplete = userInput.length === targetText.length && correctChars === targetText.length;
  
  return {
    userInput,
    correctChars,
    incorrectChars,
    currentPosition: userInput.length,
    isComplete,
    accuracy: userInput.length > 0 ? (correctChars / userInput.length) * 100 : 100
  };
};

/**
 * Gets the current word being typed based on cursor position
 * @param {string} text - The text to analyze
 * @param {number} position - The cursor position
 * @returns {Object} Current word information
 */
export const getCurrentWord = (text, position) => {
  if (!text || position < 0) {
    return { word: '', startIndex: 0, endIndex: 0 };
  }
  
  const words = text.split(' ');
  let currentIndex = 0;
  
  for (let i = 0; i < words.length; i++) {
    const wordEnd = currentIndex + words[i].length;
    
    if (position <= wordEnd) {
      return {
        word: words[i],
        startIndex: currentIndex,
        endIndex: wordEnd,
        wordIndex: i
      };
    }
    
    // Account for space after word
    currentIndex = wordEnd + 1;
  }
  
  // If position is beyond the text, return the last word
  const lastWordStart = currentIndex - words[words.length - 1].length - 1;
  return {
    word: words[words.length - 1],
    startIndex: Math.max(0, lastWordStart),
    endIndex: text.length,
    wordIndex: words.length - 1
  };
};

/**
 * Splits text into words with their positions for highlighting
 * @param {string} text - The text to split
 * @returns {Array} Array of word objects with positions
 */
export const getWordsWithPositions = (text) => {
  if (!text) return [];
  
  const words = [];
  const parts = text.split(/(\s+)/); // Split on whitespace but keep the separators
  let position = 0;
  
  parts.forEach((part, index) => {
    if (part.trim()) {
      // This is a word
      words.push({
        text: part,
        startIndex: position,
        endIndex: position + part.length,
        isWhitespace: false,
        wordIndex: Math.floor(index / 2) // Approximate word index
      });
    } else if (part) {
      // This is whitespace
      words.push({
        text: part,
        startIndex: position,
        endIndex: position + part.length,
        isWhitespace: true,
        wordIndex: -1
      });
    }
    position += part.length;
  });
  
  return words;
};