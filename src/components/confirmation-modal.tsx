"use client";

import { CheckCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmationModalProps = {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
  confirmButtonProps?: any;
  cancelButtonProps?: any;
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
};

export default function ConfirmationModal({
  open,
  handleClose,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Yes, Get Started",
  cancelLabel = "No",
  icon,
  confirmButtonProps = {},
  cancelButtonProps = {},
  showCloseButton = true,
  showCancelButton = true,
  showConfirmButton = true,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="p-6 text-center relative">
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        )}
        {icon ? icon : <CheckCircle size={90} className="mx-auto text-black" />}
        <DialogHeader>
          <DialogTitle className="mt-4 font-bold">{title}</DialogTitle>
        </DialogHeader>
        <p className="text-gray-500 mb-6">{description}</p>
        <DialogFooter className="flex justify-center space-x-2">
          {showCancelButton && (
            <Button
              variant="outline"
              onClick={onCancel || handleClose}
              {...cancelButtonProps}
            >
              {cancelLabel}
            </Button>
          )}
          {showConfirmButton && (
            <Button onClick={onConfirm || handleClose} {...confirmButtonProps}>
              {confirmLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
