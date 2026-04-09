'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function AuthPromptModal({ 
  isOpen, 
  onClose, 
  title = "Sign In Required", 
  message = "You need to be logged in to play games, join levels, or manage your wallet." 
}: AuthPromptModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[rgba(0,255,163,0.2)] bg-[#0A0F0D] p-8 shadow-[0_0_50px_rgba(0,255,163,0.1)]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon Header */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00FFA3]/20 to-transparent shadow-inner">
              <Lock className="h-10 w-10 text-[#00FFA3]" />
            </div>
          </div>

          {/* Text Content */}
          <div className="mb-8 text-center">
            <h3 className="mb-2 text-2xl font-bold text-white tracking-tight">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onClose();
                router.push("/login");
              }}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#00FFA3] py-4 font-bold text-[#07140F] transition-all hover:shadow-[0_0_25px_rgba(0,255,163,0.4)]"
            >
              <LogIn className="h-5 w-5" />
              Sign In Now
            </button>

            <button
              onClick={() => {
                onClose();
                router.push("/signup");
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-4 font-bold text-white transition-all hover:bg-white/5 hover:border-[#00FFA3]/40"
            >
              <UserPlus className="h-5 w-5" />
              Create Free Account
            </button>
          </div>

          {/* Bottom Link */}
          <button
            onClick={onClose}
            className="mt-6 w-full text-center text-xs font-medium text-gray-500 hover:text-gray-300"
          >
            Maybe Later
          </button>

          {/* Decorative Glow */}
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#00FFA3]/10 blur-[80px]" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
