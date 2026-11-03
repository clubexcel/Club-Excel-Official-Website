"use client";

import React from "react";
import { X } from "lucide-react";

interface EditModalShellProps {
  title: string;
  subtitle?: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  submitLabel?: string;
  savingLabel?: string;
  maxWidthClassName?: string;
}

const EditModalShell = ({
  title,
  subtitle,
  isSaving,
  onClose,
  onSubmit,
  children,
  submitLabel = "Save Changes",
  savingLabel = "Saving...",
  maxWidthClassName = "max-w-xl",
}: EditModalShellProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className={`bg-[#0A0A0A] border border-white/10 rounded-3xl w-full ${maxWidthClassName} p-6 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {children}

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition disabled:opacity-50"
            >
              {isSaving ? savingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModalShell;
