
import React from 'react';
import { CheckCircle, FileText, Code, Wrench, Calendar } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  isStepComplete: (step: number) => boolean;
}

const StepNavigation = ({ currentStep, onStepChange, isStepComplete }: StepNavigationProps) => {
  const steps = [
    {
      number: 1,
      title: "Basic Information",
      description: "Project title, category, and work period",
      icon: FileText,
    },
    {
      number: 2,
      title: "Technical Implementation",
      description: "Technical details, stack, and implementation approach",
      icon: Code,
    },
    {
      number: 3,
      title: "Deliverables & Progress",
      description: "Completed features, deployment, and measurable outcomes",
      icon: Wrench,
    },
    {
      number: 4,
      title: "Planning & Next Steps",
      description: "Future plans, timeline, and objectives",
      icon: Calendar,
    }
  ];

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-12">
      {/* Progress Bar Container */}
      <div className="relative mb-8">
        {/* Background line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/20"></div>
        
        {/* Progress line */}
        <div 
          className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-red-500 to-purple-600 transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = isStepComplete(step.number);
            const isActive = currentStep === step.number;
            const isAccessible = step.number <= currentStep || isCompleted;

            return (
              <div 
                key={step.number}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => isAccessible && onStepChange(step.number)}
              >
                {/* Step Circle */}
                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-500 relative z-10 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg shadow-green-500/30'
                    : isActive
                    ? 'bg-gradient-to-br from-red-500 to-purple-600 border-red-400 shadow-lg shadow-red-500/30'
                    : isAccessible
                    ? 'bg-black/40 border-white/40 hover:border-white/60 hover:bg-white/10'
                    : 'bg-black/20 border-white/20'
                } ${isAccessible ? 'hover:scale-110' : ''}`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <IconComponent className={`w-6 h-6 ${
                      isActive ? 'text-white' : isAccessible ? 'text-white/80' : 'text-white/40'
                    }`} />
                  )}
                </div>

                {/* Step Info */}
                <div className="mt-3 text-center max-w-32">
                  <div className={`text-sm font-mono transition-colors duration-300 ${
                    isActive ? 'text-white font-semibold' : isAccessible ? 'text-white/80' : 'text-white/40'
                  }`}>
                    {step.title}
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-300 hidden md:block ${
                    isActive ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
