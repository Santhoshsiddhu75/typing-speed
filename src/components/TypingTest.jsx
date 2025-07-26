import { useState } from 'react';
import TestConfiguration from './TestConfiguration';
import TimerBasedTypingTest from './TimerBasedTypingTest';

const TypingTest = () => {
  const [testConfig, setTestConfig] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleStartTest = (config) => {
    setTestConfig(config);
    setShowResults(false);
    setTestResults(null);
  };

  const handleTestComplete = (results) => {
    setTestResults(results);
    setShowResults(true);
  };

  const handleBackToSetup = () => {
    setTestConfig(null);
    setShowResults(false);
    setTestResults(null);
  };

  // Show test configuration screen
  if (!testConfig) {
    return <TestConfiguration onStartTest={handleStartTest} />;
  }

  // Show typing test
  return (
    <TimerBasedTypingTest
      duration={testConfig.duration}
      difficulty={testConfig.difficulty}
      onBack={handleBackToSetup}
      onComplete={handleTestComplete}
    />
  );
};

export default TypingTest;