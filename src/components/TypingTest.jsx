import { useState, useEffect } from 'react';

// Sample text passages for the typing test
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once, making it perfect for typing practice.",
  "In the heart of every challenge lies an opportunity to grow. Success is not measured by the absence of failure, but by the courage to keep moving forward despite setbacks.",
  "Technology has revolutionized the way we communicate, work, and learn. From smartphones to artificial intelligence, innovation continues to shape our daily lives in remarkable ways.",
  "Reading is to the mind what exercise is to the body. It strengthens our imagination, expands our vocabulary, and opens doors to countless worlds of knowledge and wonder.",
  "The art of cooking combines creativity with science. A pinch of salt, a dash of spice, and a generous helping of love can transform simple ingredients into extraordinary meals."
];

const TypingTest = () => {
  const [currentText, setCurrentText] = useState('');

  // Select a random text passage when component loads
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setCurrentText(sampleTexts[randomIndex]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Typing Speed Test
        </h1>
        <p className="text-lg text-gray-600">
          Test your typing speed and accuracy
        </p>
      </div>

      {/* Text Display Area */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Type the following text:
          </h2>
        </div>
        
        {/* Text Passage */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-lg leading-relaxed text-gray-800 font-mono">
            {currentText}
          </p>
        </div>

        {/* Placeholder for future input area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-500 italic">
            Typing input area will be implemented in the next phase
          </p>
        </div>
      </div>

      {/* New Text Button */}
      <div className="text-center">
        <button 
          onClick={() => {
            const randomIndex = Math.floor(Math.random() * sampleTexts.length);
            setCurrentText(sampleTexts[randomIndex]);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Get New Text
        </button>
      </div>
    </div>
  );
};

export default TypingTest;