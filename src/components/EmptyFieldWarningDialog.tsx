
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface EmptyFieldWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  emptyFields: string[];
}

const EmptyFieldWarningDialog = ({ isOpen, onClose, onConfirm, emptyFields }: EmptyFieldWarningDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-black/90 border-red-500/30 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Incomplete Submission</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            You left the following field{emptyFields.length > 1 ? 's' : ''} empty: <span className="text-red-400 font-semibold">{emptyFields.join(', ')}</span>.
            <br /><br />
            It is imperative that you fill out as much information as possible to provide all the context to the leadership team on the work that you've done.
            <br /><br />
            Are you sure that you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            className="border-white/20 text-white hover:bg-white/10"
          >
            No, I want to edit
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Submit anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmptyFieldWarningDialog;
