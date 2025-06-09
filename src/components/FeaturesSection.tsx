
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Shield, 
  BarChart3, 
  Clock, 
  Users, 
  FileCheck,
  Eye,
  Zap
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const FeaturesSection: React.FC = () => {
  const { isVisible } = useScrollAnimation();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze reports for quality, compliance, and insights in real-time.",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Shield,
      title: "Government-Grade Security",
      description: "Enterprise-level security protocols designed to meet Government of Alberta's stringent data protection requirements.",
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards and reporting tools provide deep insights into contractor performance and project progress.",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Clock,
      title: "Real-Time Monitoring",
      description: "Instant notifications and live tracking ensure you're always informed about critical project updates and milestones.",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Tailored interfaces for administrators and contractors with role-based permissions and customized workflows.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: FileCheck,
      title: "Automated Compliance",
      description: "Built-in compliance checking ensures all reports meet regulatory standards and government requirements automatically.",
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Eye,
      title: "Comprehensive Oversight",
      description: "360-degree visibility into all project activities with intelligent flagging of potential issues and anomalies.",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance ensures rapid report processing and instant access to critical information when you need it.",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    }
  ];

  return (
    <div 
      className="mb-20"
      data-scroll-id="features"
    >
      <div className={`text-center mb-12 transition-all duration-1000 ${
        isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h2 className="text-3xl md:text-4xl font-bold font-mono mb-4">
          POWERFUL <span className="text-blue-400">CAPABILITIES</span>
        </h2>
        <p className="text-gray-400 font-mono max-w-2xl mx-auto">
          Discover the advanced features that make Jasper the ultimate solution for government oversight and contractor management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const animationDelay = index * 100;
          
          return (
            <Card 
              key={feature.title}
              className={`bg-black/40 border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 group ${
                isVisible('features') 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: isVisible('features') ? `${animationDelay}ms` : '0ms' 
              }}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 font-mono">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-mono">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesSection;
