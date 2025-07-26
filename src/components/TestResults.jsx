import React from 'react';
import { ArrowLeft, RotateCcw, Trophy, Target, Clock, Edit3, TrendingUp } from 'lucide-react';
import MetricsDisplay from './MetricsDisplay';
import PerformanceBreakdown from './PerformanceBreakdown';

/**
 * TestResults - Comprehensive post-test results screen
 * Displays detailed typing performance metrics with visual hierarchy
 */
const TestResults = ({
  results,
  onRetry,
  onNewTest,
  previousBest = null,
  showPersonalRecords = false
}) => {
  // Calculate if this is a new personal record
  const isNewRecord = previousBest && results.wpm > previousBest.wpm;
  const isNewAccuracyRecord = previousBest && results.accuracy > previousBest.accuracy;

  // Performance level classification
  const getPerformanceLevel = (wpm) => {
    if (wpm >= 70) return { level: 'Expert', color: 'text-purple-600', bg: 'bg-purple-50' };
    if (wpm >= 50) return { level: 'Advanced', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (wpm >= 30) return { level: 'Intermediate', color: 'text-green-600', bg: 'bg-green-50' };
    return { level: 'Beginner', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  };

  const performanceLevel = getPerformanceLevel(results.wpm);

  // Calculate improvement if previous best exists
  const wpmImprovement = previousBest ? results.wpm - previousBest.wpm : 0;
  const accuracyImprovement = previousBest ? results.accuracy - previousBest.accuracy : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Achievement Notification */}
      <div className="text-center mb-8">
        {isNewRecord && (
          <div className="mb-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <Trophy className="w-6 h-6" />
              <span className="font-bold text-lg">New Personal Record!</span>
            </div>
            <p className="text-yellow-700 mt-1">
              You beat your previous best by {wpmImprovement.toFixed(1)} WPM!
            </p>
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-800 mb-2">Test Complete!</h1>
        
        {/* Performance Level Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${performanceLevel.bg} ${performanceLevel.color} mb-4`}>
          <Target className="w-4 h-4" />
          <span className="font-semibold">{performanceLevel.level} Level</span>
        </div>
      </div>

      {/* Primary Metrics Display */}
      <MetricsDisplay 
        results={results}
        isNewRecord={isNewRecord}
        isNewAccuracyRecord={isNewAccuracyRecord}
      />

      {/* Performance Breakdown */}
      <PerformanceBreakdown 
        results={results}
        previousBest={previousBest}
        showPersonalRecords={showPersonalRecords}
      />

      {/* Improvement Indicators */}
      {previousBest && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Progress vs. Previous Best
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${wpmImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {wpmImprovement >= 0 ? '+' : ''}{wpmImprovement.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">WPM Change</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${accuracyImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {accuracyImprovement >= 0 ? '+' : ''}{accuracyImprovement.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy Change</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>
        
        <button
          onClick={onNewTest}
          className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          New Test
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          <Edit3 className="w-5 h-5" />
          Save Results
        </button>
      </div>

      {/* Motivational Message */}
      <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 font-medium">
          {results.accuracy >= 95 ? "Excellent accuracy! " : results.accuracy >= 90 ? "Great accuracy! " : "Focus on accuracy next time. "}
          {results.wpm >= 50 ? "Your speed is impressive!" : results.wpm >= 30 ? "Good typing speed!" : "Keep practicing to improve your speed!"}
        </p>
        <p className="text-blue-600 text-sm mt-1">
          {isNewRecord ? "You're on fire! 🔥" : "Every practice session makes you better! 💪"}
        </p>
      </div>
    </div>
  );
};

export default TestResults;