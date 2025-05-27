import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, ArrowLeft, Send, Loader2, CheckCircle, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { submitReport } from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";

const Submit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    week: "",
    report: ""
  });
  const { user, userRole, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to submit a report");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting report:', formData);
      
      await submitReport({
        ...formData,
        user_id: user.id
      });
      
      setIsSubmitted(true);
      toast.success("Report submitted successfully!");
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      project: "",
      week: "",
      report: ""
    });
    setIsSubmitted(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-800">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5 text-neutral-400" />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-900 to-red-800 rounded-lg flex items-center justify-center border border-red-800/30">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight font-mono">SAURON</span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          {userRole === 'admin' && (
            <Link to="/dashboard">
              <Button>
                Dashboard
              </Button>
            </Link>
          )}
          <Button
            onClick={handleSignOut}
            variant="outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-6 md:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight font-mono">
              Submit Progress Report
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Submit your weekly progress report for review
            </p>
          </div>

          {!isSubmitted ? (
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="border-b border-neutral-800">
                <CardTitle className="text-2xl text-white font-mono">Weekly Progress Report</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-neutral-300 font-mono">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        className="bg-black border-neutral-700 text-white placeholder:text-neutral-500 focus:border-red-500 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-neutral-300 font-mono">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@company.com"
                        className="bg-black border-neutral-700 text-white placeholder:text-neutral-500 focus:border-red-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="project" className="text-neutral-300 font-mono">Project Name</Label>
                      <Input
                        id="project"
                        value={formData.project}
                        onChange={(e) => handleInputChange("project", e.target.value)}
                        placeholder="Project Alpha"
                        className="bg-black border-neutral-700 text-white placeholder:text-neutral-500 focus:border-red-500 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="week" className="text-neutral-300 font-mono">Week Ending</Label>
                      <Input
                        id="week"
                        type="date"
                        value={formData.week}
                        onChange={(e) => handleInputChange("week", e.target.value)}
                        className="bg-black border-neutral-700 text-white focus:border-red-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="report" className="text-neutral-300 font-mono">
                      Progress Report
                      <span className="text-sm text-neutral-500 ml-2 font-sans">
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
                      className="bg-black border-neutral-700 text-white placeholder:text-neutral-500 min-h-[200px] resize-none focus:border-red-500 transition-colors font-mono text-sm"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-lg transition-all duration-200 hover:scale-[1.02] font-mono"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Report...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center space-y-8">
              <Card className="bg-green-900/20 border-green-800/30">
                <CardContent className="p-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2 font-mono">Report Submitted Successfully!</h2>
                  <p className="text-green-300 mb-6">Your progress report has been saved and will be reviewed by the admin team.</p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={resetForm}
                      variant="outline"
                    >
                      Submit Another Report
                    </Button>
                    {userRole === 'admin' && (
                      <Link to="/dashboard">
                        <Button>
                          View Dashboard
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Cards - only show when form is visible */}
          {!isSubmitted && (
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-3 font-mono">Report Guidelines</h3>
                  <ul className="text-sm text-neutral-400 space-y-2 font-mono">
                    <li>• Include specific tasks completed</li>
                    <li>• Mention any challenges encountered</li>
                    <li>• Outline your next steps</li>
                    <li>• Be detailed and professional</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-3 font-mono">Submission Process</h3>
                  <ul className="text-sm text-neutral-400 space-y-2 font-mono">
                    <li>• Report will be saved immediately</li>
                    <li>• Admin team will review submissions</li>
                    <li>• Check dashboard for all reports</li>
                    <li>• Export data available in CSV format</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submit;
