
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Plus } from "lucide-react";
import { createAccount } from "@/services/supabaseService";
import { toast } from "sonner";

interface SimpleAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SimpleAccountDialog = ({ open, onOpenChange }: SimpleAccountDialogProps) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<'admin' | 'contractor'>('contractor');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !fullName.trim()) {
      toast.error("Email and full name are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAccount({
        email: email.trim(),
        full_name: fullName.trim(),
        company_name: companyName.trim() || undefined,
        role
      });
      
      toast.success("Account created successfully! User will need to set their password.");
      
      // Reset form
      setEmail("");
      setFullName("");
      setCompanyName("");
      setRole('contractor');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error("Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 font-mono">
            <Users className="w-5 h-5" />
            <span>Create New Account</span>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Create a new user account for your organization
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-mono">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white font-mono">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white font-mono">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Acme Inc (optional)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-white font-mono">Role</Label>
            <Select value={role} onValueChange={(value: 'admin' | 'contractor') => setRole(value)}>
              <SelectTrigger className="bg-black/20 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="contractor" className="text-white hover:bg-white/10">Contractor</SelectItem>
                <SelectItem value="admin" className="text-white hover:bg-white/10">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
