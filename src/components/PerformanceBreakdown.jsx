import React from 'react';
import { BarChart3, Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';

/**
 * PerformanceBreakdown - Detailed analysis and insights
 * Shows performance breakdown, insights, and improvement suggestions
 */
const PerformanceBreakdown = ({ results, previousBest, showPersonalRecords }) => {
  // Calculate typing consistency (simplified)
  const getConsistencyRating = (wpm, accuracy) => {
    if (accuracy >= 95 && wpm >= 40) return { rating: 'Excellent', color: 'text-green-600', icon: CheckCircle };
    if (accuracy >= 90 && wpm >= 30) return { rating: 'Good', color: 'text-blue-600', icon: CheckCircle };
    if (accuracy >= 80) return { rating: 'Fair', color: 'text-yellow-600', icon: Info };
    return { rating: 'Needs Work', color: 'text-red-600', icon: AlertTriangle };
  };

  const consistency = getConsistencyRating(results.wpm, results.accuracy);
  const ConsistencyIcon = consistency.icon;

  // Generate performance insights
  const getPerformanceInsights = () => {
    const insights = [];

    if (results.accuracy < 90) {
      insights.push({
        type: 'improvement',
        icon: AlertTriangle,
        color: 'text-amber-600',
        title: 'Focus on Accuracy',
        message: 'Your accuracy is below 90%. Slow down slightly and focus on hitting the correct keys.'
      });
    }

    if (results.wpm < 30) {
      insights.push({
        type: 'improvement',
        icon: Activity,
        color: 'text-blue-600',
        title: 'Speed Building Opportunity',
        message: 'Practice typing common words and letter combinations to increase your speed.'
      });
    }

    if (results.accuracy >= 95 && results.wpm >= 50) {
      insights.push({
        type: 'celebration',
        icon: CheckCircle,
        color: 'text-green-600',
        title: 'Excellent Performance!',
        message: 'You have great balance of speed and accuracy. Consider challenging yourself with harder texts.'
      });
    }

    if (results.wpm >= 60) {
      insights.push({
        type: 'achievement',
        icon: BarChart3,
        color: 'text-purple-600',
        title: 'Speed Demon!',
        message: 'Your typing speed is above average. You could consider competitive typing!'
      });
    }

    // Default insight if no specific ones apply
    if (insights.length === 0) {
      insights.push({
        type: 'general',
        icon: Info,
        color: 'text-blue-600',
        title: 'Keep Practicing!',
        message: 'Consistent practice is the key to improving both speed and accuracy.'
      });
    }

    return insights;
  };

  const insights = getPerformanceInsights();

  // Calculate typing efficiency
  const typingEfficiency = (results.wpm * (results.accuracy / 100)).toFixed(1);

  return (
    <div className="space-y-6 mb-8">
      {/* Performance Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Performance Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Typing Consistency */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <ConsistencyIcon className={`w-6 h-6 ${consistency.color}`} />
            </div>
            <div className={`font-semibold ${consistency.color}`}>{consistency.rating}</div>
            <div className="text-xs text-gray-600 mt-1">Typing Consistency</div>
          </div>

          {/* Typing Efficiency */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="font-semibold text-indigo-600">{typingEfficiency}</div>
            <div className="text-xs text-gray-600 mt-1">Efficiency Score</div>
          </div>

          {/* Speed Category */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <BarChart3 className="w-6 h-6 text-teal-600" />
            </div>
            <div className="font-semibold text-teal-600">
              {results.wpm >= 70 ? 'Expert' : 
               results.wpm >= 50 ? 'Advanced' : 
               results.wpm >= 30 ? 'Intermediate' : 'Beginner'}
            </div>
            <div className="text-xs text-gray-600 mt-1">Speed Level</div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-green-600" />
          Performance Insights
        </h3>

        <div className="space-y-3">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <IconComponent className={`w-5 h-5 ${insight.color} mt-0.5 flex-shrink-0`} />
                <div>
                  <div className={`font-medium ${insight.color}`}>{insight.title}</div>
                  <div className="text-sm text-gray-600">{insight.message}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Records Comparison */}
      {showPersonalRecords && previousBest && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Personal Records
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Current WPM</div>
              <div className="text-2xl font-bold text-blue-600">{results.wpm}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Best WPM</div>
              <div className="text-2xl font-bold text-green-600">{Math.max(results.wpm, previousBest.wpm)}</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              {results.wpm > previousBest.wpm ? 
                `🎉 New record! You beat your previous best by ${(results.wpm - previousBest.wpm).toFixed(1)} WPM!` :
                `Your personal best is ${(previousBest.wpm - results.wpm).toFixed(1)} WPM higher. Keep practicing!`
              }
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Summary</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• You typed <strong>{results.charactersTyped}</strong> characters in <strong>{(results.duration / 1000).toFixed(1)}</strong> seconds</p>
          <p>• Your typing speed of <strong>{results.wpm} WPM</strong> puts you in the <strong>{
            results.wpm >= 70 ? 'Expert' : 
            results.wpm >= 50 ? 'Advanced' : 
            results.wpm >= 30 ? 'Intermediate' : 'Beginner'
          }</strong> category</p>
          <p>• With <strong>{results.accuracy}%</strong> accuracy, you made approximately <strong>{Math.round((results.charactersTyped * (100 - results.accuracy)) / 100)}</strong> errors</p>
          <p>• {results.accuracy >= 95 ? 'Excellent accuracy! 🎯' : results.accuracy >= 90 ? 'Good accuracy! Keep it up! 👍' : 'Focus on accuracy in your next practice session 💪'}</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceBreakdown;