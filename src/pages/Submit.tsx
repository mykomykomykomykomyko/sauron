
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Submit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    week: "",
    report: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    toast.success("Report submitted successfully! AI analysis in progress...");
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      project: "",
      week: "",
      report: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SAURON</span>
          </div>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline" className="border-slate-400 text-white hover:bg-slate-800">
            Dashboard
          </Button>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="px-6 md:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Submit Progress Report
            </h1>
            <p className="text-xl text-slate-300">
              SAURON will analyze your submission against real-world data sources
            </p>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Weekly Progress Report</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@company.com"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project" className="text-slate-300">Project Name</Label>
                    <Input
                      id="project"
                      value={formData.project}
                      onChange={(e) => handleInputChange("project", e.target.value)}
                      placeholder="Project Alpha"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="week" className="text-slate-300">Week Ending</Label>
                    <Input
                      id="week"
                      type="date"
                      value={formData.week}
                      onChange={(e) => handleInputChange("week", e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report" className="text-slate-300">
                    Progress Report
                    <span className="text-sm text-slate-500 ml-2">
                      (Be specific about tasks completed, challenges faced, and next steps)
                    </span>
                  </Label>
                  <Textarea
                    id="report"
                    value={formData.report}
                    onChange={(e) => handleInputChange("report", e.target.value)}
                    placeholder="This week I completed the user authentication system by implementing OAuth 2.0 with Google and GitHub providers. I created 3 new API endpoints, wrote unit tests with 95% coverage, and deployed the changes to staging. 

Challenges: Encountered rate limiting issues with the GitHub API which I resolved by implementing exponential backoff.

Next week: I plan to work on the dashboard analytics feature and integrate with the reporting system..."
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 min-h-[200px] resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      AI Analysis in Progress...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit for AI Review
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">What SAURON Checks</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• GitHub commits and PR activity</li>
                  <li>• Specific vs. vague language</li>
                  <li>• Timeline consistency</li>
                  <li>• Technical accuracy</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">Scoring Criteria</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Specificity and detail level</li>
                  <li>• Evidence-backed claims</li>
                  <li>• Realistic time estimates</li>
                  <li>• Problem-solving approach</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submit;
