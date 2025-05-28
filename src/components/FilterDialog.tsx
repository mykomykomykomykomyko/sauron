
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Filter } from "lucide-react";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: { name?: string; sortBy?: 'date' | 'alphabetical'; sortOrder?: 'asc' | 'desc' }) => void;
}

export const FilterDialog = ({ open, onOpenChange, onApplyFilters }: FilterDialogProps) => {
  const [name, setName] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'alphabetical'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleApply = () => {
    onApplyFilters({
      name: name.trim() || undefined,
      sortBy,
      sortOrder
    });
    onOpenChange(false);
  };

  const handleClear = () => {
    setName("");
    setSortBy('date');
    setSortOrder('desc');
    onApplyFilters({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 font-mono">
            <Filter className="w-5 h-5" />
            <span>Advanced Filters</span>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Filter and sort reports by various criteria
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white font-mono">Filter by Name</Label>
            <Input
              id="name"
              placeholder="Enter name to filter by..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white font-mono">Sort By</Label>
              <Select value={sortBy} onValueChange={(value: 'date' | 'alphabetical') => setSortBy(value)}>
                <SelectTrigger className="bg-black/20 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  <SelectItem value="date" className="text-white hover:bg-white/10">Date</SelectItem>
                  <SelectItem value="alphabetical" className="text-white hover:bg-white/10">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white font-mono">Sort Order</Label>
              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger className="bg-black/20 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  <SelectItem value="desc" className="text-white hover:bg-white/10">Descending</SelectItem>
                  <SelectItem value="asc" className="text-white hover:bg-white/10">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClear}
            className="border-white/20 text-white/90 hover:bg-white/10 font-mono"
          >
            Clear
          </Button>
          <Button
            onClick={handleApply}
            className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-mono"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
