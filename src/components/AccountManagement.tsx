
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Building, User, Shield } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccount, getAccounts, Account } from "@/services/supabaseService";
import { toast } from "sonner";
import { format } from "date-fns";

export const AccountManagement = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("contractor");

  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });

  const createAccountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: (newAccount) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success("Account created successfully");
      setOpen(false);
      // Reset form
      setEmail("");
      setFullName("");
      setCompanyName("");
      setRole("contractor");
      
      // Send email to user
      const subject = "Account Created - The Eye of Sauron";
      const body = `Your account has been created in The Eye of Sauron system.%0D%0A%0D%0AEmail: ${newAccount.email}%0D%0APlease set up your password by visiting: ${window.location.origin}/auth`;
      
      window.location.href = `mailto:${newAccount.email}?subject=${subject}&body=${body}`;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create account");
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'contractor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white font-mono flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-400" />
              <span>Account Management</span>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Create and manage user accounts
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="font-mono">Create New Account</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Create a new user account. The user will receive an email to set up their password.
                </DialogDescription>
              </DialogHeader>
              
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
                    onClick={() => setOpen(false)}
                    className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createAccountMutation.isPending}
                    className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono"
                  >
                    {createAccountMutation.isPending ? "Creating..." : "Create Account"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-white/10 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/5 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : accounts && accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{account.full_name}</div>
                    <div className="text-gray-400 text-sm flex items-center space-x-2">
                      <Mail className="w-3 h-3" />
                      <span>{account.email}</span>
                      {account.company_name && (
                        <>
                          <Building className="w-3 h-3 ml-2" />
                          <span>{account.company_name}</span>
                        </>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs">
                      Created {account.created_at && format(new Date(account.created_at), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getRoleColor(account.role)}`}>
                    {account.role}
                  </Badge>
                  <Badge className={`text-xs ${account.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {account.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No accounts found. Create your first account to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
