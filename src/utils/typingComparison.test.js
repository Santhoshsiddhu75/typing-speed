import { describe, it, expect } from 'vitest';
import { 
  compareTypingInput, 
  getCurrentWord, 
  getWordsWithPositions 
} from './typingComparison';

describe('compareTypingInput', () => {
  const targetText = 'The quick brown fox';

  it('returns correct comparison for exact match', () => {
    const result = compareTypingInput('The quick', targetText);
    
    expect(result).toEqual({
      userInput: 'The quick',
      correctChars: 9,
      incorrectChars: 0,
      currentPosition: 9,
      isComplete: false,
      accuracy: 100
    });
  });

  it('returns correct comparison for incorrect input', () => {
    const result = compareTypingInput('Thx quick', targetText);
    
    expect(result).toEqual({
      userInput: 'Thx quick',
      correctChars: 2, // 'Th' is correct
      incorrectChars: 7, // 'x quick' is incorrect
      currentPosition: 9,
      isComplete: false,
      accuracy: 22.22222222222222 // 2/9 * 100
    });
  });

  it('handles complete correct input', () => {
    const result = compareTypingInput(targetText, targetText);
    
    expect(result).toEqual({
      userInput: targetText,
      correctChars: targetText.length,
      incorrectChars: 0,
      currentPosition: targetText.length,
      isComplete: true,
      accuracy: 100
    });
  });

  it('handles input longer than target', () => {
    const longInput = targetText + ' extra';
    const result = compareTypingInput(longInput, targetText);
    
    expect(result).toEqual({
      userInput: longInput,
      correctChars: targetText.length,
      incorrectChars: 6, // ' extra'
      currentPosition: longInput.length,
      isComplete: false,
      accuracy: 76 // 19/25 * 100
    });
  });

  it('handles empty input', () => {
    const result = compareTypingInput('', targetText);
    
    expect(result).toEqual({
      userInput: '',
      correctChars: 0,
      incorrectChars: 0,
      currentPosition: 0,
      isComplete: false,
      accuracy: 100
    });
  });

  it('handles empty target text', () => {
    const result = compareTypingInput('test', '');
    
    expect(result).toEqual({
      userInput: 'test',
      correctChars: 0,
      incorrectChars: 4,
      currentPosition: 4,
      isComplete: false,
      accuracy: 0
    });
  });
});

describe('getCurrentWord', () => {
  const text = 'The quick brown fox';

  it('returns first word when position is 0', () => {
    const result = getCurrentWord(text, 0);
    
    expect(result).toEqual({
      word: 'The',
      startIndex: 0,
      endIndex: 3,
      wordIndex: 0
    });
  });

  it('returns correct word for position in middle of word', () => {
    const result = getCurrentWord(text, 5); // 'qu' in 'quick'
    
    expect(result).toEqual({
      word: 'quick',
      startIndex: 4,
      endIndex: 9,
      wordIndex: 1
    });
  });

  it('returns correct word for position at word boundary', () => {
    const result = getCurrentWord(text, 9); // end of 'quick'
    
    expect(result).toEqual({
      word: 'quick',
      startIndex: 4,
      endIndex: 9,
      wordIndex: 1
    });
  });

  it('handles position beyond text length', () => {
    const result = getCurrentWord(text, 100);
    
    expect(result).toEqual({
      word: 'fox',
      startIndex: 16,
      endIndex: 19,
      wordIndex: 3
    });
  });

  it('handles empty text', () => {
    const result = getCurrentWord('', 0);
    
    expect(result).toEqual({
      word: '',
      startIndex: 0,
      endIndex: 0
    });
  });

  it('handles negative position', () => {
    const result = getCurrentWord(text, -1);
    
    expect(result).toEqual({
      word: '',
      startIndex: 0,
      endIndex: 0
    });
  });
});

describe('getWordsWithPositions', () => {
  it('splits simple text into words with positions', () => {
    const result = getWordsWithPositions('The quick brown');
    
    expect(result).toEqual([
      { text: 'The', startIndex: 0, endIndex: 3, isWhitespace: false, wordIndex: 0 },
      { text: ' ', startIndex: 3, endIndex: 4, isWhitespace: true, wordIndex: -1 },
      { text: 'quick', startIndex: 4, endIndex: 9, isWhitespace: false, wordIndex: 1 },
      { text: ' ', startIndex: 9, endIndex: 10, isWhitespace: true, wordIndex: -1 },
      { text: 'brown', startIndex: 10, endIndex: 15, isWhitespace: false, wordIndex: 2 }
    ]);
  });

  it('handles text with multiple spaces', () => {
    const result = getWordsWithPositions('The  quick');
    
    expect(result).toEqual([
      { text: 'The', startIndex: 0, endIndex: 3, isWhitespace: false, wordIndex: 0 },
      { text: '  ', startIndex: 3, endIndex: 5, isWhitespace: true, wordIndex: -1 },
      { text: 'quick', startIndex: 5, endIndex: 10, isWhitespace: false, wordIndex: 1 }
    ]);
  });

  it('handles empty text', () => {
    const result = getWordsWithPositions('');
    
    expect(result).toEqual([]);
  });

  it('handles single word', () => {
    const result = getWordsWithPositions('Hello');
    
    expect(result).toEqual([
      { text: 'Hello', startIndex: 0, endIndex: 5, isWhitespace: false, wordIndex: 0 }
    ]);
  });

  it('handles text with punctuation', () => {
    const result = getWordsWithPositions('Hello, world!');
    
    expect(result).toEqual([
      { text: 'Hello,', startIndex: 0, endIndex: 6, isWhitespace: false, wordIndex: 0 },
      { text: ' ', startIndex: 6, endIndex: 7, isWhitespace: true, wordIndex: -1 },
      { text: 'world!', startIndex: 7, endIndex: 13, isWhitespace: false, wordIndex: 1 }
    ]);
  });
});