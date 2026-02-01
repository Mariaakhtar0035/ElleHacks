"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
}

export function StudentFormModal({
  isOpen,
  onClose,
  onSubmit,
}: StudentFormModalProps) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrors({ name: "Name is required" });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    onSubmit({ name: trimmed });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Student">
      <form onSubmit={handleSubmit} className={`space-y-5 ${shake ? "shake" : ""}`}>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Student Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 font-display text-lg ${
              errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="e.g. Alex"
          />
          {errors.name && (
            <p className="text-red-600 text-sm font-bold mt-1">{errors.name}</p>
          )}
        </div>

        <p className="text-sm text-gray-600">
          New students start with 100 Spend tokens and 50 Grow tokens.
        </p>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Add Student
          </Button>
        </div>
      </form>
    </Modal>
  );
}
