
import { Card, CardContent } from "@/components/ui/card";
import { Send, Brain, CheckCircle, BarChart3 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface WorkflowSectionProps {
  activeStep: number;
}

const WorkflowSection = ({ activeStep }: WorkflowSectionProps) => {
  const { isVisible } = useScrollAnimation();
  
  const steps = [
    {
      icon: Send,
      title: "Submit Reports",
      description: "Contractors submit progress reports through our intuitive interface with automated validation.",
      color: "blue"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Advanced algorithms analyze submissions for quality, compliance, and potential issues.",
      color: "purple"
    },
    {
      icon: CheckCircle,
      title: "Validation",
      description: "Automated compliance checking ensures all reports meet government standards and requirements.",
      color: "green"
    },
    {
      icon: BarChart3,
      title: "Insights",
      description: "Generate actionable insights and comprehensive analytics for informed decision-making.",
      color: "red"
    }
  ];

  const getStepColor = (color: string) => {
    const colors = {
      blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
      purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
      green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
      red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="mb-20">
      <div className={`text-center mb-12 transition-all duration-1000 ${
        isVisible('workflow') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h2 className="text-3xl md:text-4xl font-bold font-mono mb-4">
          HOW IT <span className="text-red-400">WORKS</span>
        </h2>
        <p className="text-gray-400 font-mono max-w-2xl mx-auto">
          Experience the seamless workflow that transforms contractor oversight into intelligent automation
        </p>
      </div>

      <div className="relative">
        {/* Connecting Lines */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const colors = getStepColor(step.color);
            const isActive = activeStep === index;
            const animationDelay = index * 150;
            
            return (
              <div 
                key={step.title}
                className={`relative transition-all duration-1000 ${
                  isVisible('workflow') 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: isVisible('workflow') ? `${animationDelay}ms` : '0ms' 
                }}
              >
                {/* Step Number */}
                <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center z-10 transition-all duration-500 ${
                  isActive ? 'scale-125 shadow-lg' : ''
                }`}>
                  <span className={`text-sm font-bold font-mono ${colors.text}`}>
                    {index + 1}
                  </span>
                </div>

                <Card className={`bg-black/40 border-white/10 hover:border-white/20 transition-all duration-500 group h-full ${
                  isActive ? 'border-white/30 shadow-xl transform scale-105' : ''
                }`}>
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    {/* Background glow effect for active step */}
                    {isActive && (
                      <div className={`absolute inset-0 ${colors.bg} opacity-20 animate-pulse`}></div>
                    )}
                    
                    <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 relative z-10 ${
                      isActive ? 'animate-pulse' : ''
                    }`}>
                      <Icon className={`w-8 h-8 ${colors.text} ${isActive ? 'animate-pulse' : ''}`} />
                    </div>
                    
                    <h3 className={`text-xl font-bold text-white mb-3 font-mono relative z-10 ${
                      isActive ? colors.text : ''
                    }`}>
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed font-mono relative z-10">
                      {step.description}
                    </p>

                    {/* Active step indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowSection;
