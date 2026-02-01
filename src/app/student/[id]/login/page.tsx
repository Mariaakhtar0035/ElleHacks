"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getStudent } from "@/lib/store";

const SESSION_KEY = "student_session";

export default function StudentLoginPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const student = getStudent(studentId);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        if (pin.length < 4) {
          setPin((prev) => prev + e.key);
          setError("");
        }
        e.preventDefault();
      } else if (e.key === "Backspace") {
        setPin((prev) => prev.slice(0, -1));
        setError("");
        e.preventDefault();
      } else if (e.key === "Enter" && pin.length === 4 && !loading) {
        formRef.current?.requestSubmit();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, loading]);

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
      const response = await fetch("/api/student/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, pin }),
      });

      const data = await response.json();

      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem(SESSION_KEY, studentId);
        }
        router.push(`/student/${studentId}`);
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

  if (!student) {
    return (
      <div className="min-h-screen bg-[#d2e5d2] flex flex-col items-center justify-center p-4">
        <p className="text-gray-700 font-bold mb-4">Student not found.</p>
        <Link href="/" className="text-blue-600 hover:underline font-display font-bold">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d2e5d2] flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 font-display font-bold">
        ← Back
      </Link>
      <Card borderColor="border-emerald-300" className="p-8 max-w-md w-full">
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-2 text-center">
          Student Login
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter {student.name}&apos;s PIN to access your dashboard
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
