import { useState } from 'react';
import { Clock, Target, Play, Zap, Flame, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TestConfiguration = ({ onStartTest }) => {
  const [selectedTime, setSelectedTime] = useState(60); // Default 1 minute
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium'); // Default medium

  const timeOptions = [
    { 
      value: 60, 
      label: '1 min', 
      title: 'Quick Test',
      description: 'Perfect for a fast check',
      icon: Zap,
      gradient: 'from-emerald-400 to-teal-500'
    },
    { 
      value: 120, 
      label: '2 mins', 
      title: 'Standard Test',
      description: 'Balanced assessment',
      icon: Flame,
      gradient: 'from-orange-400 to-red-500'
    },
    { 
      value: 300, 
      label: '5 mins', 
      title: 'Endurance Test',
      description: 'Complete evaluation',
      icon: Dumbbell,
      gradient: 'from-purple-400 to-indigo-500'
    }
  ];

  const difficultyOptions = [
    { 
      value: 'easy', 
      label: 'Easy', 
      description: 'Common words, simple vocabulary',
      gradient: 'from-green-400 to-emerald-500',
      borderColor: 'border-green-200 hover:border-green-300',
      bgColor: 'bg-green-50/50 hover:bg-green-50/80'
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      description: 'Mixed vocabulary, moderate complexity',
      gradient: 'from-amber-400 to-orange-500',
      borderColor: 'border-amber-200 hover:border-amber-300',
      bgColor: 'bg-amber-50/50 hover:bg-amber-50/80'
    },
    { 
      value: 'hard', 
      label: 'Hard', 
      description: 'Advanced words, technical terms',
      gradient: 'from-red-400 to-rose-500',
      borderColor: 'border-red-200 hover:border-red-300',
      bgColor: 'bg-red-50/50 hover:bg-red-50/80'
    }
  ];

  const handleStartTest = () => {
    onStartTest({
      duration: selectedTime,
      difficulty: selectedDifficulty
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-chart-2 bg-clip-text text-transparent mb-6">
            Typing Speed Test
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Test your typing speed and accuracy with our professional assessment platform
          </p>
        </div>

        {/* Duration Selection */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-primary/10">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              Choose Test Duration
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {timeOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedTime === option.value;
              
              return (
                <Card
                  key={option.value}
                  className={cn(
                    "group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-large border-2",
                    isSelected 
                      ? "border-primary shadow-medium ring-2 ring-primary/20 bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:shadow-medium"
                  )}
                  onClick={() => setSelectedTime(option.value)}
                >
                  <CardContent className="p-8 text-center">
                    <div className={cn(
                      "w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-r transition-all duration-300",
                      option.gradient,
                      isSelected ? "scale-110 shadow-glow" : "group-hover:scale-105"
                    )}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {option.label}
                    </h3>
                    <div className="text-lg font-semibold text-primary mb-1">
                      {option.title}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-chart-2/10">
              <Target className="w-6 h-6 text-chart-2" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              Select Difficulty Level
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {difficultyOptions.map((option) => {
              const isSelected = selectedDifficulty === option.value;
              
              return (
                <Card
                  key={option.value}
                  className={cn(
                    "group cursor-pointer transition-all duration-300 hover:scale-105 border-2",
                    isSelected 
                      ? `${option.borderColor} shadow-medium bg-gradient-to-br ${option.bgColor} ring-2 ring-current/10` 
                      : "border-border hover:border-current/30 hover:shadow-medium",
                    option.borderColor
                  )}
                  onClick={() => setSelectedDifficulty(option.value)}
                >
                  <CardContent className="p-8 text-center relative overflow-hidden">
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-r opacity-5 transition-opacity duration-300",
                      option.gradient,
                      isSelected ? "opacity-10" : "group-hover:opacity-8"
                    )} />
                    <h3 className="text-xl font-bold text-foreground mb-3 relative z-10">
                      {option.label}
                    </h3>
                    <p className="text-muted-foreground text-sm relative z-10">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Test Configuration Summary */}
        <Card className="max-w-2xl mx-auto mb-8 bg-card/50 backdrop-blur-sm border-primary/20 animate-scale-in">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Test Configuration
            </h3>
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  {timeOptions.find(t => t.value === selectedTime)?.label}
                </span>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div className="flex items-center gap-2 text-chart-2">
                <Target className="w-5 h-5" />
                <span className="font-medium capitalize">{selectedDifficulty}</span>
              </div>
            </div>
            
            <Button
              onClick={handleStartTest}
              size="lg"
              className="bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold px-8 py-3 rounded-xl shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Typing Test
            </Button>
          </CardContent>
        </Card>

        {/* Professional Stats */}
        <div className="text-center text-muted-foreground text-sm animate-fade-in">
          <p className="flex items-center justify-center gap-4 flex-wrap">
            <span>Average: 40 WPM</span>
            <span>•</span>
            <span>Professional: 65-75 WPM</span>
            <span>•</span>
            <span>Expert: 85+ WPM</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestConfiguration;