
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Users, Sparkles, Eye, Send, Clock } from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getUsersWithReports } from "@/services/supabaseService";

interface ScheduleReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Contractor {
  id: string;
  full_name: string;
  email: string;
  company_name?: string;
  selected?: boolean;
}

export const ScheduleReportDialog = ({ open, onOpenChange }: ScheduleReportDialogProps) => {
  const [selectedContractors, setSelectedContractors] = useState<Contractor[]>([]);
  const [dueDate, setDueDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [period, setPeriod] = useState('last-week');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { data: usersWithReports = [], isLoading } = useQuery({
    queryKey: ['usersWithReports'],
    queryFn: getUsersWithReports,
    enabled: open,
  });

  const contractors: Contractor[] = usersWithReports.map(user => ({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    company_name: user.company_name,
    selected: selectedContractors.some(c => c.id === user.id)
  }));

  const periodOptions = [
    { value: "last-week", label: "Last Week" },
    { value: "last-two-weeks", label: "Last Two Weeks" },
    { value: "last-month", label: "Last Month" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
  ];

  const toggleContractor = (contractor: Contractor) => {
    setSelectedContractors(prev => {
      const isSelected = prev.some(c => c.id === contractor.id);
      if (isSelected) {
        return prev.filter(c => c.id !== contractor.id);
      } else {
        return [...prev, contractor];
      }
    });
  };

  const generateDefaultMessage = () => {
    const periodText = periodOptions.find(p => p.value === period)?.label || 'the specified period';
    return `I hope this message finds you well.

This is a gentle reminder to submit your progress report for ${periodText.toLowerCase()}. Your report is due on ${format(new Date(dueDate), 'MMMM dd, yyyy')}.

Please visit our reporting portal at https://eyeofsauron.ca/ to submit your report.

If you need any assistance or have questions about the reporting process, please don't hesitate to reach out.

Need help or assistance? Contact mykola.holovetskyi@gov.ab.ca

Thank you for your continued dedication to the project.

Best regards,
Project Management Team`;
  };

  const generateAIMessage = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please provide context for AI generation");
      return;
    }

    setIsGenerating(true);
    try {
      // This would call an AI service to generate the email
      // For now, we'll simulate it with a more contextual message
      const periodText = periodOptions.find(p => p.value === period)?.label || 'the specified period';
      const aiGeneratedMessage = `Dear Team Member,

I hope you're doing well and making great progress on your current projects.

This is a friendly reminder about your upcoming progress report for ${periodText.toLowerCase()}, which is due on ${format(new Date(dueDate), 'MMMM dd, yyyy')}.

Based on our project context: ${aiPrompt}

We're particularly interested in hearing about your achievements, any challenges you've encountered, and your plans moving forward. Your insights help us maintain project momentum and provide necessary support.

Please submit your report through our portal: https://eyeofsauron.ca/

If you have any questions or need assistance with the reporting process, I'm here to help.

Need help or assistance? Contact mykola.holovetskyi@gov.ab.ca

Thank you for your dedication and hard work.

Best regards,
Project Management Team`;

      setCustomMessage(aiGeneratedMessage);
      toast.success("AI-generated message created!");
    } catch (error) {
      toast.error("Failed to generate AI message");
    } finally {
      setIsGenerating(false);
    }
  };

  const getEmailSubject = () => {
    if (customSubject.trim()) return customSubject;
    const periodText = periodOptions.find(p => p.value === period)?.label || 'Progress';
    return `Progress Report Reminder - ${periodText} Due ${format(new Date(dueDate), 'MMM dd, yyyy')}`;
  };

  const getEmailMessage = () => {
    return customMessage.trim() || generateDefaultMessage();
  };

  const sendEmails = () => {
    if (selectedContractors.length === 0) {
      toast.error("Please select at least one contractor");
      return;
    }

    const subject = encodeURIComponent(getEmailSubject());
    const body = encodeURIComponent(getEmailMessage());
    const recipients = selectedContractors.map(c => c.email).join(',');
    
    const mailtoLink = `mailto:${recipients}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
    
    toast.success(`Email client opened for ${selectedContractors.length} contractor(s)`);
    onOpenChange(false);
  };

  const resetForm = () => {
    setSelectedContractors([]);
    setCustomSubject('');
    setCustomMessage('');
    setAiPrompt('');
    setShowPreview(false);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/95 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            <span>Schedule Report Reminders</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contractor Selection */}
          <Card className="bg-black/40 border-white/20">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-400" />
                <span>Select Contractors</span>
                {selectedContractors.length > 0 && (
                  <Badge className="bg-green-500/20 text-green-400">
                    {selectedContractors.length} selected
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse h-12 bg-white/10 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  {contractors.map((contractor) => (
                    <div
                      key={contractor.id}
                      onClick={() => toggleContractor(contractor)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        contractor.selected
                          ? 'border-green-500/50 bg-green-500/20'
                          : 'border-white/20 hover:border-white/40 bg-black/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{contractor.full_name}</div>
                          <div className="text-sm text-gray-400">{contractor.email}</div>
                          {contractor.company_name && (
                            <div className="text-xs text-gray-500">{contractor.company_name}</div>
                          )}
                        </div>
                        {contractor.selected && (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date and Period Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-mono flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span>Due Date</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-neutral-900/50 border-white/20 text-white font-mono"
                />
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-mono flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span>Report Period</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="bg-neutral-900/50 border-white/20 text-white font-mono">
                    <SelectValue placeholder="Select period..." />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Email Customization */}
          <Card className="bg-black/40 border-white/20">
            <CardHeader>
              <CardTitle className="text-lg font-mono flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>Email Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 font-mono">Custom Subject (optional)</label>
                <Input
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder={getEmailSubject()}
                  className="bg-neutral-900/50 border-white/20 text-white font-mono mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-300 font-mono">AI Context (for generation)</label>
                  <Button
                    onClick={generateAIMessage}
                    disabled={isGenerating || !aiPrompt.trim()}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-mono"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate AI Message
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe the projects, specific areas to focus on, or any context for the AI to generate a personalized message..."
                  className="bg-neutral-900/50 border-white/20 text-white font-mono resize-none h-20"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 font-mono">Custom Message (optional)</label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Leave empty to use default message template..."
                  className="bg-neutral-900/50 border-white/20 text-white font-mono resize-none h-32 mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {showPreview && (
            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-lg font-mono flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <span>Email Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400 font-mono">To:</span>
                    <span className="ml-2 text-white">
                      {selectedContractors.map(c => c.email).join(', ') || 'No contractors selected'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-mono">Subject:</span>
                    <span className="ml-2 text-white">{getEmailSubject()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-mono">Message:</span>
                    <div className="mt-2 p-3 bg-neutral-900/50 border border-white/10 rounded text-gray-200 whitespace-pre-wrap font-mono text-xs">
                      {getEmailMessage()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>

            <div className="flex space-x-3">
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
              >
                Cancel
              </Button>
              <Button
                onClick={sendEmails}
                disabled={selectedContractors.length === 0}
                className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono"
              >
                <Send className="w-4 h-4 mr-2" />
                Open Email Client ({selectedContractors.length})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
