
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
      position: { x: 15, y: 75 }
    },
    {
      title: "AI Processing", 
      icon: Brain,
      perspective: "system",
      description: "Intelligent analysis extracts insights and validates data",
      detail: "Advanced algorithms ensure quality and consistency",
      position: { x: 40, y: 45 }
    },
    {
      title: "Staff Review",
      icon: Users,
      perspective: "staff", 
      description: "Government teams receive analyzed reports with insights",
      detail: "Streamlined review process with AI-powered recommendations",
      position: { x: 70, y: 30 }
    },
    {
      title: "Dashboard Analytics",
      icon: BarChart3,
      perspective: "system",
      description: "Real-time insights and performance tracking for all stakeholders",
      detail: "Comprehensive visibility into project progress and trends",
      position: { x: 85, y: 65 }
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
      <DialogContent className="max-w-6xl h-[80vh] bg-slate-800 border-slate-600 text-white overflow-hidden">
        <DialogHeader className="border-b border-slate-600 pb-4">
          <div className="flex items-center justify-center space-x-3">
            <Compass className="w-8 h-8 text-orange-400" />
            <DialogTitle className="text-3xl font-bold text-center">
              JASPER WORKFLOW MAP
            </DialogTitle>
          </div>
          <p className="text-slate-400 text-center font-mono">
            Navigate the complete progress reporting journey
          </p>
        </DialogHeader>

        <div className="flex-1 relative overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="text-slate-600">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* Topographic Lines */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" className="text-slate-500">
                <path d="M0,100 Q200,80 400,120 T800,100" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M0,200 Q300,180 600,220 T1200,200" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M0,300 Q250,280 500,320 T1000,300" fill="none" stroke="currentColor" strokeWidth="2"/>
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
                  d={`M ${step.position.x} ${step.position.y} Q ${(step.position.x + nextStep.position.x) / 2} ${Math.min(step.position.y, nextStep.position.y) - 10} ${nextStep.position.x} ${nextStep.position.y}`}
                  fill="none"
                  strokeWidth="0.8"
                  strokeDasharray="2,2"
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
                  <MapPin className={`w-12 h-12 transition-all duration-500 ${
                    isActive ? 'text-orange-400 scale-125' : 'text-slate-500 scale-100'
                  }`} />
                  
                  {/* Step Icon in Pin */}
                  <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    getStepColor(index)
                  } shadow-lg`}>
                    <StepIcon className="w-3 h-3" />
                  </div>
                  
                  {/* Pulse Animation for Active Step */}
                  {isActive && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-orange-400 animate-ping" />
                  )}
                </div>

                {/* Step Info Card */}
                <div className={`mt-2 transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
                }`}>
                  <div className={`bg-slate-700/90 backdrop-blur-sm border rounded-lg p-3 min-w-48 shadow-xl ${
                    getPerspectiveColor(step.perspective)
                  }`}>
                    <div className="text-center">
                      <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                      <p className="text-xs text-slate-300 mb-2">{step.description}</p>
                      <div className="text-xs opacity-75">{step.detail}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Current Step Spotlight */}
          <div 
            className="absolute w-32 h-32 rounded-full bg-orange-400/10 border-2 border-orange-400/30 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000"
            style={{ 
              left: `${steps[currentStep].position.x}%`, 
              top: `${steps[currentStep].position.y}%` 
            }}
          />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-4 z-20">
            <h4 className="text-sm font-bold mb-3 flex items-center">
              <Route className="w-4 h-4 mr-2 text-orange-400" />
              Journey Map
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-400"></div>
                <span className="text-emerald-400">Contractor Actions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-violet-500/40 border border-violet-400"></div>
                <span className="text-violet-400">System Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-400"></div>
                <span className="text-amber-400">Staff Review</span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-4 z-20">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-slate-400">Step</span>
              <span className="text-orange-400 font-bold">{currentStep + 1}</span>
              <span className="text-slate-400">of</span>
              <span className="text-slate-300">{steps.length}</span>
            </div>
            <div className="mt-2 flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-1 rounded-full transition-all duration-500 ${
                    index <= currentStep ? 'bg-orange-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-600 pt-4 flex justify-center">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 font-mono"
          >
            Close Map
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreModal;
