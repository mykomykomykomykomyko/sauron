
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Send, Brain, Users, BarChart3, User, MapPin, Route, Compass } from 'lucide-react';

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Contractor Submits",
      icon: Send,
      perspective: "contractor",
      description: "Field teams submit progress reports from project sites",
      detail: "Simple, guided reporting from anywhere in the field",
      position: { x: 15, y: 25 }
    },
    {
      title: "AI Processing", 
      icon: Brain,
      perspective: "system",
      description: "Intelligent analysis extracts insights and validates data",
      detail: "Advanced algorithms ensure quality and consistency",
      position: { x: 40, y: 50 }
    },
    {
      title: "Staff Review",
      icon: Users,
      perspective: "staff", 
      description: "Government teams receive analyzed reports with insights",
      detail: "Streamlined review process with AI-powered recommendations",
      position: { x: 70, y: 25 }
    },
    {
      title: "Dashboard Analytics",
      icon: BarChart3,
      perspective: "system",
      description: "Real-time insights and performance tracking for all stakeholders",
      detail: "Comprehensive visibility into project progress and trends",
      position: { x: 85, y: 75 }
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsAnimating(false);
      return;
    }

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  const getPerspectiveColor = (perspective: string) => {
    switch (perspective) {
      case 'contractor': return 'text-emerald-400 bg-emerald-500/20 border-emerald-400/40';
      case 'staff': return 'text-amber-400 bg-amber-500/20 border-amber-400/40';
      case 'system': return 'text-violet-400 bg-violet-500/20 border-violet-400/40';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-400/40';
    }
  };

  const getStepColor = (index: number) => {
    if (index === currentStep) return 'border-orange-400 bg-orange-500/30 shadow-orange-400/30';
    return 'border-slate-600 bg-slate-700/50 shadow-slate-700/30';
  };

  const getPathColor = (index: number) => {
    if (index <= currentStep) return 'stroke-orange-400';
    return 'stroke-slate-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 w-screen h-screen max-w-none max-h-none bg-slate-800 border-none text-white p-0 m-0 rounded-none">
        {/* Header */}
        <DialogHeader className="border-b border-slate-600 p-4 sm:p-6 lg:p-8 flex-shrink-0">
          <div className="flex items-center justify-center space-x-3">
            <Compass className="w-8 h-8 lg:w-10 lg:h-10 text-orange-400" />
            <DialogTitle className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center">
              JASPER WORKFLOW MAP
            </DialogTitle>
          </div>
          <p className="text-slate-400 text-center font-mono text-base sm:text-lg lg:text-xl mt-2">
            Navigate the complete progress reporting journey
          </p>
        </DialogHeader>

        {/* Main Content Area - Full Viewport */}
        <div className="flex-1 relative overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="text-slate-600">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* Topographic Lines */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" className="text-slate-500">
                <path d="M0,20% Q25%,15% 50%,25% T100%,20%" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M0,40% Q25%,35% 50%,45% T100%,40%" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M0,60% Q25%,55% 50%,65% T100%,60%" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M0,80% Q25%,75% 50%,85% T100%,80%" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>

          {/* Journey Path */}
          <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" className="fill-orange-400" />
              </marker>
            </defs>
            
            {/* Connecting paths between steps */}
            {steps.slice(0, -1).map((step, index) => {
              const nextStep = steps[index + 1];
              return (
                <path
                  key={index}
                  d={`M ${step.position.x} ${step.position.y} Q ${(step.position.x + nextStep.position.x) / 2} ${Math.min(step.position.y, nextStep.position.y) - 8} ${nextStep.position.x} ${nextStep.position.y}`}
                  fill="none"
                  strokeWidth="1.2"
                  strokeDasharray="3,3"
                  markerEnd="url(#arrowhead)"
                  className={`transition-all duration-1000 ${getPathColor(index)}`}
                />
              );
            })}
          </svg>

          {/* Step Markers */}
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            
            return (
              <div
                key={step.title}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ 
                  left: `${step.position.x}%`, 
                  top: `${step.position.y}%` 
                }}
              >
                {/* Location Pin */}
                <div className="relative">
                  <MapPin className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 transition-all duration-500 ${
                    isActive ? 'text-orange-400 scale-125' : 'text-slate-500 scale-100'
                  }`} />
                  
                  {/* Step Icon in Pin */}
                  <div className={`absolute top-2 sm:top-2.5 lg:top-3 xl:top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    getStepColor(index)
                  } shadow-lg`}>
                    <StepIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
                  </div>
                  
                  {/* Pulse Animation for Active Step */}
                  {isActive && (
                    <div className="absolute top-2 sm:top-2.5 lg:top-3 xl:top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full border-2 border-orange-400 animate-ping" />
                  )}
                </div>

                {/* Step Info Card */}
                <div className={`mt-2 sm:mt-3 lg:mt-4 transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
                }`}>
                  <div className={`bg-slate-700/90 backdrop-blur-sm border rounded-lg p-3 sm:p-4 lg:p-5 w-40 sm:w-48 lg:w-56 xl:w-64 shadow-xl ${
                    getPerspectiveColor(step.perspective)
                  }`}>
                    <div className="text-center">
                      <h4 className="font-bold text-sm sm:text-base lg:text-lg mb-2">{step.title}</h4>
                      <p className="text-xs sm:text-sm lg:text-base text-slate-300 mb-2 lg:mb-3">{step.description}</p>
                      <div className="text-xs sm:text-sm opacity-75">{step.detail}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Current Step Spotlight */}
          <div 
            className="absolute w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-full bg-orange-400/10 border-2 border-orange-400/30 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000"
            style={{ 
              left: `${steps[currentStep].position.x}%`, 
              top: `${steps[currentStep].position.y}%` 
            }}
          />

          {/* Legend */}
          <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-4 sm:p-5 lg:p-6 z-20">
            <h4 className="text-sm sm:text-base lg:text-lg font-bold mb-3 sm:mb-4 flex items-center">
              <Route className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 text-orange-400" />
              Journey Map
            </h4>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500/40 border border-emerald-400"></div>
                <span className="text-emerald-400">Contractor</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-violet-500/40 border border-violet-400"></div>
                <span className="text-violet-400">System</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-500/40 border border-amber-400"></div>
                <span className="text-amber-400">Staff</span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-4 sm:p-5 lg:p-6 z-20">
            <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base lg:text-lg">
              <span className="text-slate-400">Step</span>
              <span className="text-orange-400 font-bold">{currentStep + 1}</span>
              <span className="text-slate-400">of</span>
              <span className="text-slate-300">{steps.length}</span>
            </div>
            <div className="mt-2 sm:mt-3 flex space-x-1 sm:space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-1.5 sm:w-8 sm:h-2 lg:w-10 lg:h-2 rounded-full transition-all duration-500 ${
                    index <= currentStep ? 'bg-orange-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Close Button - Top Right */}
          <div className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8 z-30">
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 font-mono text-sm sm:text-base lg:text-lg"
            >
              Close Map
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreModal;
