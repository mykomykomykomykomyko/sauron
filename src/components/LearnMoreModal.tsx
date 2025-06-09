
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Send, Brain, CheckCircle, BarChart3, User, Users, ArrowRight } from 'lucide-react';

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Contractor Submits Report",
      icon: Send,
      perspective: "contractor",
      description: "Contractors easily submit progress reports through our intuitive interface",
      detail: "Simple form-based reporting with guided prompts and validation"
    },
    {
      title: "AI Analysis Begins", 
      icon: Brain,
      perspective: "system",
      description: "Advanced AI algorithms analyze the submission for quality and compliance",
      detail: "Intelligent processing identifies key metrics and potential concerns"
    },
    {
      title: "Staff Review & Validation",
      icon: Users,
      perspective: "staff", 
      description: "Government staff receive analyzed reports with highlighted insights",
      detail: "Pre-processed data enables faster, more informed decision-making"
    },
    {
      title: "Insights & Analytics",
      icon: BarChart3,
      perspective: "system",
      description: "Comprehensive dashboards provide actionable insights for all stakeholders",
      detail: "Real-time tracking and performance analytics drive better outcomes"
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
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  const getPerspectiveColor = (perspective: string) => {
    switch (perspective) {
      case 'contractor': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'staff': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'system': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getPerspectiveIcon = (perspective: string) => {
    switch (perspective) {
      case 'contractor': return User;
      case 'staff': return Users;
      default: return Brain;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-mono text-center mb-2">
            HOW <span className="text-red-400">JASPER</span> WORKS
          </DialogTitle>
          <p className="text-gray-400 font-mono text-center">
            End-to-end progress report management and analysis
          </p>
        </DialogHeader>

        <div className="py-8">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentStep ? 'bg-red-400 scale-125' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main Animation Area */}
          <div className="relative h-80 bg-black/40 rounded-lg border border-white/10 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 grid-rows-8 h-full">
                {Array.from({ length: 96 }, (_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              <div className="text-center space-y-6">
                {/* Perspective Indicator */}
                <div className="flex justify-center mb-4">
                  {(() => {
                    const PerspectiveIcon = getPerspectiveIcon(steps[currentStep].perspective);
                    return (
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                        getPerspectiveColor(steps[currentStep].perspective)
                      }`}>
                        <PerspectiveIcon className="w-6 h-6" />
                      </div>
                    );
                  })()}
                </div>

                {/* Main Icon */}
                <div className="relative">
                  {(() => {
                    const StepIcon = steps[currentStep].icon;
                    return (
                      <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/30">
                        <StepIcon className="w-12 h-12 text-red-400" />
                      </div>
                    );
                  })()}
                  
                  {/* Animated Pulse Ring */}
                  <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-red-400/30 animate-ping mx-auto" />
                </div>

                {/* Step Info */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold font-mono text-white">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-lg text-gray-300 font-mono max-w-md mx-auto">
                    {steps[currentStep].description}
                  </p>
                  <p className="text-sm text-gray-400 font-mono max-w-lg mx-auto">
                    {steps[currentStep].detail}
                  </p>
                </div>
              </div>
            </div>

            {/* Flow Arrows */}
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-xs font-mono">STEP {currentStep + 1} OF {steps.length}</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.title}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    index === currentStep 
                      ? 'border-red-500/50 bg-red-500/10' 
                      : 'border-white/10 bg-black/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      getPerspectiveColor(step.perspective)
                    }`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-mono text-white">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-mono capitalize">
                        {step.perspective}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center pt-4 border-t border-white/10">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 font-mono"
          >
            Got It
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnMoreModal;
