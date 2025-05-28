
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Mail, Building, User, Zap, Clock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccount, Account } from "@/services/supabaseService";
import { sendMagicLink } from "@/services/magicLinkService";
import { toast } from "sonner";

export const MagicLinkAccountDialog = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("contractor");
  const [step, setStep] = useState<'create' | 'sending' | 'sent'>('create');

  const queryClient = useQueryClient();

  const createAccountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: async (newAccount) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setStep('sending');
      
      try {
        await sendMagicLink({ 
          email: newAccount.email,
          redirectTo: `${window.location.origin}/dashboard`
        });
        
        setStep('sent');
        toast.success("Account created and magic link sent!");
      } catch (error: any) {
        toast.error(`Account created but failed to send magic link: ${error.message}`);
        setStep('create');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create account");
      setStep('create');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAccountMutation.mutate({
      email,
      full_name: fullName,
      company_name: companyName || undefined,
      role,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setStep('create');
    setEmail("");
    setFullName("");
    setCompanyName("");
    setRole("contractor");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono">
          <Zap className="w-4 h-4 mr-2" />
          Create Account + Magic Link
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="font-mono">
            {step === 'create' && 'Create Account with Magic Link'}
            {step === 'sending' && 'Sending Magic Link...'}
            {step === 'sent' && 'Magic Link Sent!'}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {step === 'create' && 'Create a new user account and send them a magic link to sign in instantly.'}
            {step === 'sending' && 'Creating account and sending magic link...'}
            {step === 'sent' && 'The user will receive an email with a magic link that expires in 1 hour.'}
          </DialogDescription>
        </DialogHeader>
        
        {step === 'create' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-mono">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white font-mono">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white font-mono">Company Name (Optional)</Label>
              <Input
                id="companyName"
                placeholder="Acme Corporation"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white font-mono">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-black/20 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  <SelectItem value="contractor" className="text-white hover:bg-white/10">Contractor</SelectItem>
                  <SelectItem value="admin" className="text-white hover:bg-white/10">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAccountMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono"
              >
                {createAccountMutation.isPending ? "Creating..." : "Create & Send Magic Link"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'sending' && (
          <div className="flex flex-col items-center space-y-4 py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-gray-300">Creating account and sending magic link...</p>
          </div>
        )}

        {step === 'sent' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Mail className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-green-400 font-mono font-bold">Magic Link Sent!</p>
                <p className="text-green-300 text-sm">Check {email} for the login link</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-yellow-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Link expires in 1 hour</span>
            </div>
            
            <DialogFooter>
              <Button
                onClick={handleClose}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-mono w-full"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
