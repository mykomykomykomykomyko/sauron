import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Shield, Send, Sparkles, ArrowRight, Brain, Target, FileText, Code, Wrench, Calendar, Link, Github } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { analyzeReport } from "@/services/aiAnalysis";
import StepNavigation from "@/components/StepNavigation";
import EmptyFieldWarningDialog from "@/components/EmptyFieldWarningDialog";

const Submit = () => {
  // Basic info
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [customPriority, setCustomPriority] = useState("");

  // Technical details
  const [technicalImplementation, setTechnicalImplementation] = useState("");
  const [challengesSolved, setChallengesSolved] = useState("");
  const [technologyStack, setTechnologyStack] = useState("");

  // Deliverables
  const [completedFeatures, setCompletedFeatures] = useState("");
  const [deploymentDetails, setDeploymentDetails] = useState("");
  const [measureableProgress, setMeasureableProgress] = useState("");

  // Planning
  const [nextSteps, setNextSteps] = useState("");
  const [timeline, setTimeline] = useState("");
  const [goals, setGoals] = useState("");

  // Additional context
  const [workPeriod, setWorkPeriod] = useState("");
  const [customWorkPeriod, setCustomWorkPeriod] = useState("");
  const [timeSpent, setTimeSpent] = useState("");

  // New optional fields for links
  const [githubRepo, setGithubRepo] = useState("");
  const [projectLinks, setProjectLinks] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

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

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const validateAndGetEmptyFields = () => {
    const empty: string[] = [];
    
    // Basic info validation
    if (!title.trim()) empty.push("Project Title");
    if (!category && !customCategory.trim()) empty.push("Category");
    if (!priority && !customPriority.trim()) empty.push("Priority");
    if (!workPeriod && !customWorkPeriod.trim()) empty.push("Work Period");
    if (!timeSpent.trim()) empty.push("Time Spent");
    
    // Technical details validation
    if (!technicalImplementation.trim()) empty.push("Technical Implementation");
    if (!technologyStack.trim()) empty.push("Technology Stack");
    if (!challengesSolved.trim()) empty.push("Challenges Solved");
    
    // Deliverables validation
    if (!completedFeatures.trim()) empty.push("Completed Features");
    if (!deploymentDetails.trim()) empty.push("Deployment Details");
    if (!measureableProgress.trim()) empty.push("Measurable Progress");
    
    // Planning validation
    if (!nextSteps.trim()) empty.push("Next Steps");
    if (!timeline.trim()) empty.push("Timeline");
    if (!goals.trim()) empty.push("Goals");
    
    return empty;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emptyFieldsList = validateAndGetEmptyFields();
    
    if (emptyFieldsList.length > 0) {
      setEmptyFields(emptyFieldsList);
      setShowWarningDialog(true);
      return;
    }
    
    await submitReport();
  };

  const submitReport = async () => {
    setIsSubmitting(true);
    try {
      // Use custom values if "other" was selected, otherwise use the dropdown values
      const finalCategory = category === "other" ? customCategory : category;
      const finalPriority = priority === "other" ? customPriority : priority;
      const finalWorkPeriod = workPeriod === "other" ? customWorkPeriod : workPeriod;

      // Construct comprehensive report description with optional links
      let reportDescription = `
PROJECT: ${title}

TECHNICAL IMPLEMENTATION:
${technicalImplementation}

TECHNOLOGY STACK:
${technologyStack}

COMPLETED FEATURES & DELIVERABLES:
${completedFeatures}

DEPLOYMENT DETAILS:
${deploymentDetails}

CHALLENGES SOLVED:
${challengesSolved}

MEASURABLE PROGRESS:
${measureableProgress}

NEXT STEPS & PLANNING:
${nextSteps}

TIMELINE:
${timeline}

GOALS & OBJECTIVES:
${goals}

TIME SPENT: ${timeSpent}
WORK PERIOD: ${finalWorkPeriod}`;

      // Add optional links if provided
      if (githubRepo || projectLinks) {
        reportDescription += `

PROJECT LINKS:`;
        if (githubRepo) {
          reportDescription += `
GitHub Repository: ${githubRepo}`;
        }
        if (projectLinks) {
          reportDescription += `
Additional Links: ${projectLinks}`;
        }
      }

      reportDescription = reportDescription.trim();

      const periodMap: { [key: string]: string } = {
        today: new Date().toISOString().split('T')[0],
        "this-week": new Date().toISOString().split('T')[0],
        "last-week": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "last-two-weeks": new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "last-month": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "last-quarter": new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "last-year": new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      const reportData = {
        name: user.user_metadata?.full_name || user.email || "Unknown User",
        email: user.email || "",
        project: finalCategory,
        week: periodMap[finalWorkPeriod] || new Date().toISOString().split('T')[0],
        report: reportDescription,
        user_id: user.id,
        title: title,
        description: reportDescription,
        category: finalCategory,
        priority: finalPriority,
        github_repo: githubRepo || null,
        project_links: projectLinks || null
      };

      await analyzeReport(reportData);
      toast.success("Report submitted successfully! You can view the status in your dashboard.");

      // Reset all form fields
      setTitle("");
      setCategory("");
      setCustomCategory("");
      setPriority("");
      setCustomPriority("");
      setTechnicalImplementation("");
      setChallengesSolved("");
      setTechnologyStack("");
      setCompletedFeatures("");
      setDeploymentDetails("");
      setMeasureableProgress("");
      setNextSteps("");
      setTimeline("");
      setGoals("");
      setWorkPeriod("");
      setCustomWorkPeriod("");
      setTimeSpent("");
      setGithubRepo("");
      setProjectLinks("");
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

  const handleWarningConfirm = () => {
    setShowWarningDialog(false);
    submitReport();
  };

  const handleWarningClose = () => {
    setShowWarningDialog(false);
  };

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 15 + 10
  }));

  const steps = [
    {
      number: 1,
      title: "Basic Information",
      description: "Project title, category, and work period",
      icon: FileText,
      fields: ["title", "category", "priority", "workPeriod", "timeSpent"]
    },
    {
      number: 2,
      title: "Technical Implementation", 
      description: "Technical details, stack, and implementation approach",
      icon: Code,
      fields: ["technicalImplementation", "technologyStack", "challengesSolved"]
    },
    {
      number: 3,
      title: "Deliverables & Progress",
      description: "Completed features, deployment, and measurable outcomes", 
      icon: Wrench,
      fields: ["completedFeatures", "deploymentDetails", "measureableProgress"]
    },
    {
      number: 4,
      title: "Planning & Links",
      description: "Future plans, timeline, and project resources",
      icon: Calendar,
      fields: ["nextSteps", "timeline", "goals"]
    }
  ];

  const categories = [
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
    { value: "testing", label: "Testing" },
    { value: "deployment", label: "Deployment" },
    { value: "maintenance", label: "Maintenance" },
    { value: "research", label: "Research" },
    { value: "other", label: "Other" }
  ];

  const priorities = [
    { value: "low", label: "Low Priority", color: "text-green-400" },
    { value: "medium", label: "Medium Priority", color: "text-yellow-400" },
    { value: "high", label: "High Priority", color: "text-orange-400" },
    { value: "critical", label: "Critical", color: "text-red-400" },
    { value: "other", label: "Other", color: "text-gray-400" }
  ];

  const workPeriods = [
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "last-week", label: "Last Week" },
    { value: "last-two-weeks", label: "Last Two Weeks" },
    { value: "last-month", label: "Last Month" },
    { value: "last-quarter", label: "Last Quarter" },
    { value: "last-year", label: "Last Year" },
    { value: "other", label: "Other" }
  ];

  const isStepComplete = (stepNumber: number): boolean => {
    // Allow navigation to any step regardless of completion
    return false;
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/30"></div>
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-orange-900/10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-transparent"></div>

      {/* Animated mesh gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Dynamic cursor glow */}
      <div className="fixed w-96 h-96 bg-gradient-radial from-red-500/15 via-purple-500/8 to-transparent rounded-full blur-3xl pointer-events-none z-0 transition-all duration-500 hidden md:block" style={{
        left: mousePosition.x - 192,
        top: mousePosition.y - 192
      }}></div>

      {/* Floating particles */}
      {particles.map(particle => (
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
            opacity: 0.4
          }}
        />
      ))}

      {/* Header */}
      <nav className="flex items-center justify-between p-4 sm:p-6 md:p-8 border-b border-white/10 backdrop-blur-xl bg-black/30 relative z-10">
        <RouterLink to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 via-purple-600 to-red-700 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
            <Eye className="w-5 h-5 mr-2" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">JASPER</span>
            <span className="text-xs text-gray-400 font-mono hidden sm:block">COMPREHENSIVE REPORT SUBMISSION</span>
          </div>
        </RouterLink>

        <div className="flex items-center space-x-4">
          <RouterLink to="/dashboard">
            <Button variant="outline" size="sm" className="border-white/20 text-white/90 hover:bg-white/10 font-mono">
              <Shield className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </RouterLink>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-white/20 rounded-full px-6 py-3 backdrop-blur-xl mb-6">
              <Brain className="w-5 h-5 text-red-400" />
              <span className="text-sm font-mono text-white/90">AI-OPTIMIZED REPORT SUBMISSION</span>
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold font-mono mb-6 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              COMPREHENSIVE REPORT
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Submit a detailed progress report optimized for AI analysis. Our system evaluates technical content, deliverables, clarity, planning, and professionalism.
            </p>
          </div>

          {/* Step Navigation */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <StepNavigation 
              currentStep={currentStep} 
              onStepChange={handleStepChange} 
              isStepComplete={isStepComplete} 
            />
          </div>

          {/* Form Card */}
          <Card className={`bg-black/40 border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-mono text-white flex items-center justify-center space-x-3">
                {currentStepData?.icon && <currentStepData.icon className="w-6 h-6 text-red-400" />}
                <span>{currentStepData?.title}</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                {currentStepData?.description}
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
                        <span>Project Title</span>
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Enter a descriptive title for your project"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-white font-mono">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="bg-black/20 border-white/20 text-white focus:border-red-400 focus:ring-red-400">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                            {categories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10">
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {category === "other" && (
                          <Input
                            placeholder="Specify your category"
                            value={customCategory}
                            onChange={e => setCustomCategory(e.target.value)}
                            className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 mt-2"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority" className="text-white font-mono">Priority</Label>
                        <Select value={priority} onValueChange={setPriority}>
                          <SelectTrigger className="bg-black/20 border-white/20 text-white focus:border-red-400 focus:ring-red-400">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                            {priorities.map(prio => (
                              <SelectItem key={prio.value} value={prio.value} className="text-white hover:bg-white/10">
                                <span className={prio.color}>{prio.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {priority === "other" && (
                          <Input
                            placeholder="Specify your priority level"
                            value={customPriority}
                            onChange={e => setCustomPriority(e.target.value)}
                            className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 mt-2"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="workPeriod" className="text-white font-mono">Work Period</Label>
                        <Select value={workPeriod} onValueChange={setWorkPeriod}>
                          <SelectTrigger className="bg-black/20 border-white/20 text-white focus:border-red-400 focus:ring-red-400">
                            <SelectValue placeholder="Select work period" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                            {workPeriods.map(period => (
                              <SelectItem key={period.value} value={period.value} className="text-white hover:bg-white/10">
                                {period.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {workPeriod === "other" && (
                          <Input
                            placeholder="Specify your work period"
                            value={customWorkPeriod}
                            onChange={e => setCustomWorkPeriod(e.target.value)}
                            className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 mt-2"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeSpent" className="text-white font-mono">Time Spent</Label>
                        <Input
                          id="timeSpent"
                          type="text"
                          placeholder="e.g., 8 hours, 2 days, 1 week"
                          value={timeSpent}
                          onChange={e => setTimeSpent(e.target.value)}
                          className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Technical Implementation */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="technicalImplementation" className="text-white font-mono flex items-center space-x-2">
                        <Code className="w-4 h-4" />
                        <span>Technical Implementation Details</span>
                      </Label>
                      <Textarea
                        id="technicalImplementation"
                        placeholder="Describe the technical approach, algorithms, code structure, implementation methodology..."
                        value={technicalImplementation}
                        onChange={e => setTechnicalImplementation(e.target.value)}
                        rows={6}
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technologyStack" className="text-white font-mono">Technology Stack</Label>
                      <Textarea
                        id="technologyStack"
                        placeholder="List programming languages, frameworks, databases, tools, libraries used..."
                        value={technologyStack}
                        onChange={e => setTechnologyStack(e.target.value)}
                        rows={4}
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="challengesSolved" className="text-white font-mono">Challenges Solved</Label>
                      <Textarea
                        id="challengesSolved"
                        placeholder="Describe technical challenges encountered and how they were resolved..."
                        value={challengesSolved}
                        onChange={e => setChallengesSolved(e.target.value)}
                        rows={4}
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Deliverables & Progress */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="completedFeatures" className="text-white font-mono flex items-center space-x-2">
                        <Wrench className="w-4 h-4" />
                        <span>Completed Features & Deliverables</span>
                      </Label>
                      <Textarea
                        id="completedFeatures"
                        placeholder="List specific features, modules, components completed. Be detailed and specific..."
                        value={completedFeatures}
                        onChange={e => setCompletedFeatures(e.target.value)}
                        rows={6}
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deploymentDetails" className="text-white font-mono">Deployment & Testing Details</Label>
                      <Textarea
                        id="deploymentDetails"
                        placeholder="Describe deployment process, testing methodology, URLs, screenshots, performance metrics..."
                        value={deploymentDetails}
                        onChange={e => setDeploymentDetails(e.target.value)}
                        rows={4}
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="measureableProgress" className="text-white font-mono">Measurable Progress & Metrics</Label>
                      <Textarea
                        id="measureableProgress"
                        placeholder="Provide quantifiable metrics, performance improvements, user feedback, ROI calculations..."
                        value={measureableProgress}
                        onChange={e => setMeasureableProgress(e.target.value)}
                        rows={4}
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Planning & Links */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nextSteps" className="text-white font-mono flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Next Steps & Action Items</span>
                      </Label>
                      <Textarea
                        id="nextSteps"
                        placeholder="Outline specific next steps, action items, and immediate priorities..."
                        value={nextSteps}
                        onChange={e => setNextSteps(e.target.value)}
                        rows={5}
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeline" className="text-white font-mono">Timeline & Milestones</Label>
                      <Textarea
                        id="timeline"
                        placeholder="Provide detailed timeline, milestones, deadlines, and delivery expectations..."
                        value={timeline}
                        onChange={e => setTimeline(e.target.value)}
                        rows={4}
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goals" className="text-white font-mono">Goals & Objectives</Label>
                      <Textarea
                        id="goals"
                        placeholder="Define clear goals, objectives, success criteria, and expected outcomes..."
                        value={goals}
                        onChange={e => setGoals(e.target.value)}
                        rows={4}
                        className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                      />
                    </div>

                    {/* Optional Project Links Section */}
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-lg font-mono text-white mb-4 flex items-center space-x-2">
                        <Link className="w-5 h-5 text-blue-400" />
                        <span>Project Links (Optional)</span>
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="githubRepo" className="text-white font-mono flex items-center space-x-2">
                            <Github className="w-4 h-4" />
                            <span>GitHub Repository</span>
                          </Label>
                          <Input
                            id="githubRepo"
                            type="url"
                            placeholder="https://github.com/username/repository"
                            value={githubRepo}
                            onChange={e => setGithubRepo(e.target.value)}
                            className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="projectLinks" className="text-white font-mono flex items-center space-x-2">
                            <Link className="w-4 h-4" />
                            <span>Additional Project Links</span>
                          </Label>
                          <Textarea
                            id="projectLinks"
                            placeholder="Live demo: https://example.com&#10;Documentation: https://docs.example.com&#10;Design files: https://figma.com/..."
                            value={projectLinks}
                            onChange={e => setProjectLinks(e.target.value)}
                            rows={3}
                            className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 focus:border-red-400 focus:ring-red-400 resize-none"
                          />
                          <p className="text-xs text-gray-400">
                            Include demo URLs, documentation links, design files, or any other relevant project resources
                          </p>
                        </div>
                      </div>
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
                  
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="ml-auto bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono group"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-mono group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      <Send className="w-4 h-4 mr-2 relative z-10" />
                      <span className="relative z-10">
                        {isSubmitting ? "Analyzing..." : "Submit Report"}
                      </span>
                      <Sparkles className="w-4 h-4 ml-2 relative z-10 group-hover:animate-pulse" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className={`mt-12 grid md:grid-cols-5 gap-4 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {[
              {
                icon: Code,
                title: "Technical Content",
                score: "30 pts",
                description: "Implementation details, algorithms, code structure"
              },
              {
                icon: Wrench,
                title: "Deliverables",
                score: "25 pts",
                description: "Completed features, measurable outcomes"
              },
              {
                icon: Brain,
                title: "Clarity",
                score: "20 pts",
                description: "Communication quality, structure, detail"
              },
              {
                icon: Calendar,
                title: "Planning",
                score: "15 pts",
                description: "Next steps, timeline, goal setting"
              },
              {
                icon: Shield,
                title: "Professionalism",
                score: "10 pts",
                description: "Format, tone, time specificity"
              }
            ].map((category, index) => (
              <Card key={index} className="bg-black/20 border-white/10 hover:border-white/30 transition-all duration-300 group backdrop-blur-xl">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-lg font-bold text-red-400 font-mono mb-1">{category.score}</div>
                  <h3 className="text-sm font-mono text-white mb-2">{category.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Empty Field Warning Dialog */}
      <EmptyFieldWarningDialog
        isOpen={showWarningDialog}
        onClose={handleWarningClose}
        onConfirm={handleWarningConfirm}
        emptyFields={emptyFields}
      />

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
