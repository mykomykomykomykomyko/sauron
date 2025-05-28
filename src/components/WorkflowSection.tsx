
import { Upload, Brain, Shield, BarChart3 } from "lucide-react";

interface WorkflowSectionProps {
  activeStep: number;
}

const WorkflowSection = ({ activeStep }: WorkflowSectionProps) => {
  const workflowSteps = [
    {
      number: 1,
      title: "Submit Report",
      description: "Contractors submit detailed progress reports through our intuitive interface",
      icon: Upload,
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Advanced neural networks process and validate submissions in real-time",
      icon: Brain,
      color: "from-purple-500 to-pink-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    },
    {
      number: 3,
      title: "Quality Review",
      description: "Automated quality checks ensure compliance and accuracy",
      icon: Shield,
      color: "from-green-500 to-emerald-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
    {
      number: 4,
      title: "Dashboard Insights",
      description: "Generate actionable insights and performance metrics",
      icon: BarChart3,
      color: "from-orange-500 to-red-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    }
  ];

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-12 font-mono">
        HOW THE SYSTEM <span className="text-red-400">WORKS</span>
      </h2>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {workflowSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = activeStep === index;
            
            return (
              <div key={step.number} className="relative">
                <div className={`relative group transition-all duration-500 ${isActive ? 'scale-105' : ''}`}>
                  <div className={`absolute inset-0 rounded-xl ${step.bgColor} ${step.borderColor} border-2 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : 'opacity-50'}`}></div>
                  
                  <div className="relative p-6 text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${isActive ? 'scale-110 shadow-lg' : ''}`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    
                    <div className={`w-8 h-8 mx-auto mb-3 rounded-full border-2 ${step.borderColor} ${step.bgColor} flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110' : ''}`}>
                      <span className="text-white font-bold text-sm">{step.number}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 font-mono">{step.title}</h3>
                    
                    <p className="text-gray-400 text-sm font-mono leading-relaxed">
                      {step.description}
                    </p>
                    
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowSection;
