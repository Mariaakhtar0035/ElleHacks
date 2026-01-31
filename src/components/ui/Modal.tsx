"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl border-4 border-gray-300 shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="border-b-4 border-gray-200 px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
