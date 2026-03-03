"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
}

export default function CountdownTimer({ targetDate, label }: CountdownTimerProps) {

  const calculateTimeLeft = () => {
    const now = Date.now();
    const distance = targetDate.getTime() - now;

    return {
      days: Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((distance / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((distance / (1000 * 60)) % 60)),
      seconds: Math.max(0, Math.floor((distance / 1000) % 60)),
    };
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="mt-6">
      {label && (
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
          {label}
        </p>
      )}

      <div className="flex gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-surface border border-[rgba(0,255,163,0.18)] flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={unit.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-bold text-[#00FFA3]"
                >
                  {String(unit.value).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>

            <span className="text-[10px] text-muted-foreground mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}