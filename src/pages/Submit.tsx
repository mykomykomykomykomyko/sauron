
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Send, Eye, Brain, CheckCircle, AlertCircle, Sparkles, Target, ArrowRight, Zap, Clock, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabaseService } from "@/services/supabaseService";

const Submit = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reportData = {
        title,
        description,
        category,
        priority,
      };

      await supabaseService.createReport(reportData);
      toast.success("Report submitted successfully! AI analysis in progress...");
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("");
      setCurrentStep(1);
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 10,
  }));

  const steps = [
    {
      number: 1,
      title: "Report Details",
      description: "Provide basic information about your progress",
      icon: FileText,
      fields: ["title", "category", "priority"]
    },
    {
      number: 2,
      title: "Detailed Description",
      description: "Describe your progress and any challenges",
      icon: Brain,
      fields: ["description"]
    },
    {
      number: 3,
      title: "AI Analysis",
      description: "Our AI will process and validate your report",
      icon: Zap,
      fields: []
    }
  ];

  const categories = [
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
    { value: "testing", label: "Testing" },
    { value: "deployment", label: "Deployment" },
    { value: "maintenance", label: "Maintenance" },
    { value: "research", label: "Research" },
  ];

  const priorities = [
    { value: "low", label: "Low Priority", color: "text-green-400" },
    { value: "medium", label: "Medium Priority", color: "text-yellow-400" },
    { value: "high", label: "High Priority", color: "text-orange-400" },
    { value: "critical", label: "Critical", color: "text-red-400" },
  ];

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return title && category && priority;
      case 2:
        return description;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/30"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-orange-900/10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-transparent"></div>

      {/* Animated mesh gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Dynamic cursor glow */}
      <div 
        className="fixed w-96 h-96 bg-gradient-radial from-red-500/15 via-purple-500/8 to-transparent rounded-full blur-3xl pointer-events-none z-0 transition-all duration-500 hidden md:block"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `linear-gradient(45deg, #ef4444, #8b5cf6, #06b6d4)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: 0.4,
          }}
        />
      ))}

      {/* Header */}
      <nav className="flex items-center justify-between p-4 sm:p-6 md:p-8 border-b border-white/10 backdrop-blur-xl bg-black/30 relative z-10">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 via-purple-600 to-red-700 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
            <Eye className="w-5 h-5 sm:w-7 sm:h-7 text-white relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
              THE EYE OF SAURON
            </span>
            <span className="text-xs text-gray-400 font-mono hidden sm:block">REPORT SUBMISSION</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="border-white/20 text-white/90 hover:bg-white/10 font-mono">
              <Shield className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-white/20 rounded-full px-6 py-3 backdrop-blur-xl mb-6">
              <FileText className="w-5 h-5 text-red-400" />
              <span className="text-sm font-mono text-white/90">PROGRESS REPORT SUBMISSION</span>
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold font-mono mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              SUBMIT REPORT
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Submit your progress report for AI-powered analysis and validation. Our advanced algorithms will process your submission in real-time.
            </p>
          </div>

          {/* Progress Steps */}
          <div className={`mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="flex items-center justify-center space-x-4 sm:space-x-8 mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center space-x-3 transition-all duration-500 ${
                    currentStep >= step.number ? 'scale-110' : 'scale-100 opacity-60'
                  }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                      currentStep > step.number 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-lg shadow-green-500/30'
                        : currentStep === step.number
                        ? 'bg-gradient-to-br from-red-500 to-purple-600 border-red-400 shadow-lg shadow-red-500/30'
                        : 'bg-black/40 border-white/20'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <step.icon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <div className={`text-sm font-mono transition-colors duration-300 ${
                        currentStep >= step.number ? 'text-white' : 'text-gray-500'
                      }`}>
                        Step {step.number}
                      </div>
                      <div className={`text-xs transition-colors duration-300 ${
                        currentStep >= step.number ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-all duration-500 ${
                      currentStep > step.number 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                        : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className={`bg-black/40 border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-mono text-white flex items-center justify-center space-x-3">
                {steps[currentStep - 1]?.icon && <steps[currentStep - 1].icon className="w-6 h-6 text-red-400" />}
                <span>{steps[currentStep - 1]?.title}</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                {steps[currentStep - 1]?.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white font-mono flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Report Title</span>
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Enter a descriptive title for your report"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-white font-mono">Category</Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger className="bg-black/20 border-white/20 text-white focus:border-red-400 focus:ring-red-400">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10">
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority" className="text-white font-mono">Priority</Label>
                        <Select value={priority} onValueChange={setPriority} required>
                          <SelectTrigger className="bg-black/20 border-white/20 text-white focus:border-red-400 focus:ring-red-400">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                            {priorities.map((prio) => (
                              <SelectItem key={prio.value} value={prio.value} className="text-white hover:bg-white/10">
                                <span className={prio.color}>{prio.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Description */}
                {currentStep === 2 && (
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white font-mono flex items-center space-x-2">
                      <Brain className="w-4 h-4" />
                      <span>Detailed Description</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of your progress, achievements, and any challenges encountered..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={8}
                      className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                    />
                    <div className="text-sm text-gray-400 mt-2">
                      {description.length} characters • Minimum 50 characters recommended
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
                    >
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < 2 ? (
                    <Button
                      type="button"
                      onClick={() => {
                        if (isStepComplete(currentStep)) {
                          setCurrentStep(currentStep + 1);
                        } else {
                          toast.error("Please complete all required fields");
                        }
                      }}
                      disabled={!isStepComplete(currentStep)}
                      className="ml-auto bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono group"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isStepComplete(2)}
                      className="ml-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-mono group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      <Send className="w-4 h-4 mr-2 relative z-10" />
                      <span className="relative z-10">
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                      </span>
                      <Sparkles className="w-4 h-4 ml-2 relative z-10 group-hover:animate-pulse" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features Info */}
          <div className={`mt-12 grid md:grid-cols-3 gap-6 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {[
              {
                icon: Brain,
                title: "AI Validation",
                description: "Advanced algorithms validate your report against multiple data sources"
              },
              {
                icon: Clock,
                title: "Real-time Processing",
                description: "Get instant feedback and insights as soon as you submit"
              },
              {
                icon: Shield,
                title: "Secure Storage",
                description: "Your reports are encrypted and stored with enterprise-grade security"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-black/20 border-white/10 hover:border-white/30 transition-all duration-300 group backdrop-blur-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-mono text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        .bg-gradient-radial {
          background: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default Submit;
