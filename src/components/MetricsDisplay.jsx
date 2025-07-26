import React from 'react';
import { Clock, Zap, Target, Type, Star } from 'lucide-react';

/**
 * MetricsDisplay - Primary performance metrics with visual hierarchy
 * Shows WPM, accuracy, time, and character counts prominently
 */
const MetricsDisplay = ({ results, isNewRecord, isNewAccuracyRecord }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    return formatTime(totalSeconds);
  };

  // Calculate error rate
  const errorRate = results.charactersTyped > 0 
    ? ((results.charactersTyped * (100 - results.accuracy)) / 100).toFixed(0)
    : 0;

  return (
    <div className="mb-8">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* WPM - Most Important */}
        <div className={`relative p-6 rounded-xl text-center ${isNewRecord ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300' : 'bg-blue-50'}`}>
          {isNewRecord && (
            <div className="absolute -top-2 -right-2">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
            </div>
          )}
          <div className="flex justify-center mb-2">
            <Zap className={`w-8 h-8 ${isNewRecord ? 'text-yellow-600' : 'text-blue-600'}`} />
          </div>
          <div className={`text-4xl font-bold ${isNewRecord ? 'text-yellow-700' : 'text-blue-600'} mb-1`}>
            {results.wpm}
          </div>
          <div className={`text-sm font-medium ${isNewRecord ? 'text-yellow-600' : 'text-gray-600'}`}>
            Words Per Minute
          </div>
          {isNewRecord && (
            <div className="text-xs text-yellow-600 font-medium mt-1">NEW RECORD!</div>
          )}
        </div>

        {/* Accuracy */}
        <div className={`relative p-6 rounded-xl text-center ${isNewAccuracyRecord ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300' : 'bg-green-50'}`}>
          {isNewAccuracyRecord && (
            <div className="absolute -top-2 -right-2">
              <Star className="w-6 h-6 text-green-500 fill-current" />
            </div>
          )}
          <div className="flex justify-center mb-2">
            <Target className={`w-8 h-8 ${isNewAccuracyRecord ? 'text-green-700' : 'text-green-600'}`} />
          </div>
          <div className={`text-4xl font-bold ${isNewAccuracyRecord ? 'text-green-700' : 'text-green-600'} mb-1`}>
            {results.accuracy}%
          </div>
          <div className={`text-sm font-medium ${isNewAccuracyRecord ? 'text-green-600' : 'text-gray-600'}`}>
            Accuracy
          </div>
          {isNewAccuracyRecord && (
            <div className="text-xs text-green-600 font-medium mt-1">NEW RECORD!</div>
          )}
        </div>

        {/* Time Taken */}
        <div className="bg-purple-50 p-6 rounded-xl text-center">
          <div className="flex justify-center mb-2">
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-4xl font-bold text-purple-600 mb-1">
            {formatDuration(results.duration)}
          </div>
          <div className="text-sm font-medium text-gray-600">Time Taken</div>
        </div>

        {/* Characters Typed */}
        <div className="bg-orange-50 p-6 rounded-xl text-center">
          <div className="flex justify-center mb-2">
            <Type className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-4xl font-bold text-orange-600 mb-1">
            {results.charactersTyped}
          </div>
          <div className="text-sm font-medium text-gray-600">Characters</div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-800">{results.wordsTyped || Math.floor(results.charactersTyped / 5)}</div>
          <div className="text-xs text-gray-600">Words Typed</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{errorRate}</div>
          <div className="text-xs text-gray-600">Errors Made</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-indigo-600">
            {results.charactersTyped > 0 ? (results.charactersTyped / (results.duration / 1000)).toFixed(1) : '0.0'}
          </div>
          <div className="text-xs text-gray-600">Chars/Second</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-teal-600">
            {results.difficulty ? results.difficulty.charAt(0).toUpperCase() + results.difficulty.slice(1) : 'Medium'}
          </div>
          <div className="text-xs text-gray-600">Difficulty</div>
        </div>
      </div>

      {/* Performance Bar */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Accuracy Progress</span>
          <span className="text-sm text-gray-600">{results.accuracy}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              results.accuracy >= 95 ? 'bg-green-500' : 
              results.accuracy >= 90 ? 'bg-blue-500' : 
              results.accuracy >= 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(results.accuracy, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;