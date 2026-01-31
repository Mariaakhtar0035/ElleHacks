"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Reward } from "@/types";

const ICON_OPTIONS = ["⏰", "💡", "📝", "🎁", "⭐", "🏆", "🎯", "🌟", "🎨", "📚"];

interface RewardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward?: Reward | null;
  onSubmit: (data: { title: string; description: string; cost: number; icon: string; soldOut?: boolean }) => void;
}

export function RewardFormModal({
  isOpen,
  onClose,
  reward,
  onSubmit,
}: RewardFormModalProps) {
  const isEdit = !!reward;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(50);
  const [icon, setIcon] = useState("🎁");
  const [soldOut, setSoldOut] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string; cost?: string }>({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(reward?.title ?? "");
      setDescription(reward?.description ?? "");
      setCost(reward?.cost ?? 50);
      setIcon(reward?.icon ?? "🎁");
      setSoldOut(reward?.soldOut ?? false);
      setErrors({});
    }
  }, [isOpen, reward]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; description?: string; cost?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    const costNum = Number(cost);
    if (Number.isNaN(costNum) || costNum < 1) newErrors.cost = "Enter a cost of 1 or more";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      cost: costNum,
      icon: icon || "🎁",
      soldOut,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Reward" : "Add Reward"}
    >
      <form onSubmit={handleSubmit} className={`space-y-5 ${shake ? "shake" : ""}`}>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 font-display text-lg ${
              errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="e.g. Extra Deadline Extension"
          />
          {errors.title && (
            <p className="text-red-600 text-sm font-bold mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl border-2 font-display ${
              errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="What does this reward do?"
          />
          {errors.description && (
            <p className="text-red-600 text-sm font-bold mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Token Cost</label>
          <input
            type="number"
            min={1}
            value={cost}
            onChange={(e) => setCost(Number(e.target.value) || 0)}
            className={`w-full px-4 py-3 rounded-xl border-2 font-display text-lg ${
              errors.cost ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.cost && (
            <p className="text-red-600 text-sm font-bold mt-1">{errors.cost}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Icon</label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setIcon(opt)}
                className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all hover:-translate-y-0.5 ${
                  icon === opt ? "border-gray-800 shadow-md bg-amber-50" : "border-gray-300 bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="soldOut"
            checked={soldOut}
            onChange={(e) => setSoldOut(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-gray-300"
          />
          <label htmlFor="soldOut" className="text-sm font-bold text-gray-700">
            Sold Out (students cannot purchase)
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {isEdit ? "Save Reward" : "Add Reward"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
