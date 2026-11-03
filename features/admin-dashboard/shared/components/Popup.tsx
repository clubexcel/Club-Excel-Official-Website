"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

interface PopupProps {
  show: boolean;
  type?: "success" | "error" | "confirm";
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isConfirm?: boolean;
}

export type PopupType = "success" | "error" | "confirm";

const Popup: React.FC<PopupProps> = ({
  show,
  type = "success",
  message,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirm = false,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !isConfirm && onClose()}
          ></motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center overflow-hidden"
          >
            {/* Decorative background gradient */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[60px] opacity-20 -z-10 ${
                type === "success"
                  ? "bg-green-500"
                  : type === "error"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
            ></div>

            <div className="flex justify-center mb-6">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
                  type === "success"
                    ? "bg-green-500/10 text-green-500"
                    : type === "error"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-yellow-500/10 text-yellow-500"
                }`}
              >
                {type === "success" && <CheckCircle2 className="w-10 h-10" />}
                {type === "error" && <AlertCircle className="w-10 h-10" />}
                {type === "confirm" && <AlertTriangle className="w-10 h-10" />}
              </div>
            </div>

            <h3 className="text-xl font-black mb-3 text-white uppercase tracking-tight">
              {type === "success"
                ? "Success!"
                : type === "error"
                  ? "Error"
                  : "Are you sure?"}
            </h3>

            <p className="text-neutral-400 text-sm leading-relaxed mb-8 font-medium">
              {message}
            </p>

            <div className="flex flex-col gap-3">
              {isConfirm ? (
                <>
                  <button
                    onClick={onConfirm}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                      type === "error" || type === "confirm"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white text-black hover:bg-neutral-200"
                    }`}
                  >
                    {confirmText}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-neutral-500 hover:text-white transition-all bg-white/5 hover:bg-white/10"
                  >
                    {cancelText}
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-all shadow-[0_10px_20px_-5px_rgba(255,255,255,0.1)]"
                >
                  Continue
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
