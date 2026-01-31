"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function TeacherLoginPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError("Please enter a 4-digit PIN");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/teacher/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/teacher");
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
    <div className="min-h-screen bg-[#d2e5d2] flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 font-display font-bold">
        ← Back
      </Link>
      <Card borderColor="border-blue-300" className="p-8 max-w-md w-full">
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-2 text-center">
          Teacher Login
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your 4-digit PIN to access the teacher dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PIN Display */}
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-14 h-14 border-2 border-gray-300 rounded-xl flex items-center justify-center text-2xl font-bold bg-gray-50"
              >
                {pin[i] ? "●" : ""}
              </div>
            ))}
          </div>

          {error && (
            <div className="text-center text-red-600 font-bold">{error}</div>
          )}

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumberClick(num.toString())}
                className="h-14 bg-gray-100 hover:bg-gray-200 rounded-xl text-2xl font-bold transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-14 bg-red-100 hover:bg-red-200 rounded-xl text-lg font-bold transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick("0")}
              className="h-14 bg-gray-100 hover:bg-gray-200 rounded-xl text-2xl font-bold transition-colors disabled:opacity-50"
              disabled={loading}
            >
              0
            </button>
            <button
              type="submit"
              disabled={loading || pin.length !== 4}
              className="h-14 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Enter"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
