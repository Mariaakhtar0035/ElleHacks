"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const MAX_QUESTION_LENGTH = 200;

interface AskNarratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

export function AskNarratorModal({
  isOpen,
  onClose,
  studentName,
}: AskNarratorModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    setLoading(true);
    setAnswer(null);
    setError(false);

    try {
      const response = await fetch("/api/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, question: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      setAnswer(data.answer ?? "I'm not sure right now. Ask your teacher or try again!");
    } catch {
      setError(true);
      setAnswer("I'm not sure right now. Ask your teacher or try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuestion("");
    setAnswer(null);
    setError(false);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ask the Narrator">
      <div className="space-y-4">
        <p className="text-gray-700 font-medium">
          Ask anything about tokens, missions, or saving! The narrator will answer in kid-friendly words.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ask-question" className="sr-only">
              Your question
            </label>
            <textarea
              id="ask-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, MAX_QUESTION_LENGTH))}
              maxLength={MAX_QUESTION_LENGTH}
              rows={3}
              placeholder="e.g. Why do I have two kinds of tokens?"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 font-display text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {question.length}/{MAX_QUESTION_LENGTH} characters
            </p>
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !question.trim()}
            className="w-full"
          >
            {loading ? "Asking..." : "Ask"}
          </Button>
        </form>

        {answer !== null && (
          <div
            className={`rounded-2xl border-2 p-4 ${
              error ? "border-amber-300 bg-amber-50" : "border-blue-200 bg-blue-50"
            }`}
          >
            <p className="font-display font-bold text-gray-900 mb-2">Narrator says:</p>
            <p className="text-gray-800">{answer}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
