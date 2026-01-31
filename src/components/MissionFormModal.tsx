"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Mission, MissionBandColor, MISSION_BAND_COLORS } from "@/types";

const BAND_LABELS: Record<MissionBandColor, string> = {
  red: "Red",
  green: "Green",
  blue: "Blue",
  amber: "Amber",
  orange: "Orange",
  purple: "Purple",
  sky: "Light Blue",
  brown: "Brown",
};

const BAND_PREVIEW: Record<MissionBandColor, string> = {
  red: "bg-red-400",
  green: "bg-green-500",
  blue: "bg-blue-500",
  amber: "bg-amber-400",
  orange: "bg-orange-400",
  purple: "bg-purple-500",
  sky: "bg-sky-400",
  brown: "bg-amber-700",
};

interface MissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: Mission | null;
  onSubmit: (data: { title: string; description: string; baseReward: number; bandColor?: MissionBandColor }) => void;
}

export function MissionFormModal({
  isOpen,
  onClose,
  mission,
  onSubmit,
}: MissionFormModalProps) {
  const isEdit = !!mission;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [baseReward, setBaseReward] = useState(100);
  const [bandColor, setBandColor] = useState<MissionBandColor | "">("");
  const [errors, setErrors] = useState<{ title?: string; description?: string; baseReward?: string }>({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(mission?.title ?? "");
      setDescription(mission?.description ?? "");
      setBaseReward(mission?.baseReward ?? 100);
      setBandColor(mission?.bandColor ?? "");
      setErrors({});
    }
  }, [isOpen, mission]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; description?: string; baseReward?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    const reward = Number(baseReward);
    if (Number.isNaN(reward) || reward < 1) newErrors.baseReward = "Enter a reward of 1 or more";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      baseReward: reward,
      bandColor: bandColor || undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Mission" : "Add Mission"}
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
            placeholder="e.g. Organize Classroom Library"
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
            placeholder="Short, friendly description of the mission"
          />
          {errors.description && (
            <p className="text-red-600 text-sm font-bold mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Base Token Reward</label>
          <input
            type="number"
            min={1}
            value={baseReward}
            onChange={(e) => setBaseReward(Number(e.target.value) || 0)}
            className={`w-full px-4 py-3 rounded-xl border-2 font-display text-lg ${
              errors.baseReward ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.baseReward && (
            <p className="text-red-600 text-sm font-bold mt-1">{errors.baseReward}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Category / Top Color</label>
          <div className="flex flex-wrap gap-2">
            {MISSION_BAND_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setBandColor(bandColor === color ? "" : color)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-display font-bold transition-all hover:-translate-y-0.5 ${
                  bandColor === color
                    ? "border-gray-800 shadow-md"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full ${BAND_PREVIEW[color]} border-2 border-gray-800`}
                />
                <span>{BAND_LABELS[color]}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Optional. Picks a color automatically if left blank.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {isEdit ? "Save Mission" : "Add Mission"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
