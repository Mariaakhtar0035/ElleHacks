"use client";

import React, { useEffect, useState } from "react";

interface SuccessSparkleProps {
  show: boolean;
  onComplete?: () => void;
  duration?: number;
}

export function SuccessSparkle({
  show,
  onComplete,
  duration = 1500,
}: SuccessSparkleProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  if (!visible || !show) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      aria-hidden
    >
      <div className="text-8xl animate-bounce-in opacity-90">
        ✨🎉✨
      </div>
    </div>
  );
}
