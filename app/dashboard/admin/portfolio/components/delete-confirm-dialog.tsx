"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { toast } from "sonner";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  portfolioId,
}: DeleteConfirmDialogProps) {
  const onDelete = async () => {
    try {
      // Add your delete API call here
      toast.success("Portfolio item deleted");
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            portfolio item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
