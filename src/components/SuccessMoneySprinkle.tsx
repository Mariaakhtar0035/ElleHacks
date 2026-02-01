"use client";
import { useEffect, useRef } from "react";

// Utility to get a random integer between min and max
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function SuccessMoneySprinkle() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let isActive = true;
    
    const createBill = () => {
      if (!isActive || !container) return;
      
      const bill = document.createElement("div");
      bill.textContent = "$";
      bill.className = "fixed z-50 text-green-500 font-black pointer-events-none select-none";
      bill.style.fontSize = "3.75rem";
      bill.style.left = `${randInt(5, 95)}vw`;
      bill.style.top = `-10rem`;
      bill.style.transition = `transform 6s cubic-bezier(.4,2,.6,1), opacity 2s`;
      bill.style.transform = `translateY(0)`;
      bill.style.opacity = "1";
      bill.style.rotate = `${randInt(-30, 30)}deg`;
      container.appendChild(bill);
      
      setTimeout(() => {
        bill.style.transform = `translateY(${randInt(60, 90)}vh)`;
        bill.style.opacity = "0";
      }, 50);
      
      // Remove bill after animation completes
      setTimeout(() => {
        bill.remove();
      }, 8000);
    };
    
    // Keep creating new bills continuously at steady rate
    const interval = setInterval(() => {
      createBill();
    }, 100);
    
    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} />;
}
