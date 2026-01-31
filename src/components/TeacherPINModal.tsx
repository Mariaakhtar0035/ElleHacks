"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface TeacherPINModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherPINModal({ isOpen, onClose }: TeacherPINModalProps) {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
      setError("");
    }
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/teacher/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/teacher");
        onClose();
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Teacher Login">
      <div className="space-y-6">
        <p className="text-center text-gray-700">
          Enter your 4-digit PIN to access the teacher dashboard
        </p>

        {/* PIN Display */}
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-14 h-14 border-4 border-gray-300 rounded-xl flex items-center justify-center text-2xl font-bold"
            >
              {pin[i] ? "●" : ""}
            </div>
          ))}
        </div>

        {error && (
          <div className="text-center text-red-600 font-bold">
            {error}
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="h-14 bg-gray-100 hover:bg-gray-200 rounded-xl text-2xl font-bold transition-colors"
              disabled={loading}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 bg-red-100 hover:bg-red-200 rounded-xl text-lg font-bold transition-colors"
            disabled={loading}
          >
            Clear
          </button>
          <button
            onClick={() => handleNumberClick("0")}
            className="h-14 bg-gray-100 hover:bg-gray-200 rounded-xl text-2xl font-bold transition-colors"
            disabled={loading}
          >
            0
          </button>
          <button
            onClick={handleSubmit}
            className="h-14 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg font-bold transition-colors disabled:opacity-50"
            disabled={loading || pin.length !== 4}
          >
            {loading ? "..." : "Enter"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
