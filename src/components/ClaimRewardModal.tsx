"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PendingReward } from "@/types";
import { getRecommendedSplit } from "@/lib/store";

interface ClaimRewardModalProps {
  pendingReward: PendingReward;
  studentName?: string;
  onClaim: (spendAmount: number, saveAmount: number, growAmount: number) => void;
  onClose: () => void;
}

const SPEND_VS_GROW_FALLBACK =
  "You earned tokens! Some go to Spend (use now), some to Save, and some to Grow (locked and growing).";

export function ClaimRewardModal({
  pendingReward,
  studentName = "Student",
  onClaim,
  onClose,
}: ClaimRewardModalProps) {
  const recommended = getRecommendedSplit(pendingReward.totalAmount);
  const [spendAmount, setSpendAmount] = useState(recommended.spend);
  const [saveAmount, setSaveAmount] = useState(recommended.save);
  const [growAmount, setGrowAmount] = useState(recommended.grow);
  const [error, setError] = useState<string | null>(null);
  const [splitExplanation, setSplitExplanation] = useState<string | null>(null);
  const [loadingSplitExplanation, setLoadingSplitExplanation] = useState(false);

  useEffect(() => {
    setSpendAmount(recommended.spend);
    setSaveAmount(recommended.save);
    setGrowAmount(recommended.grow);
  }, [pendingReward.id, recommended.spend, recommended.save, recommended.grow]);

  const handleUseRecommended = () => {
    setSpendAmount(recommended.spend);
    setSaveAmount(recommended.save);
    setGrowAmount(recommended.grow);
    setError(null);
  };

  const handleSpendChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || value === "") {
      setSpendAmount(0);
      return;
    }
    const spend = Math.max(0, Math.min(num, pendingReward.totalAmount));
    setSpendAmount(spend);
    setError(null);
  };

  const handleSaveChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || value === "") {
      setSaveAmount(0);
      return;
    }
    const save = Math.max(0, Math.min(num, pendingReward.totalAmount));
    setSaveAmount(save);
    setError(null);
  };

  const handleGrowChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || value === "") {
      setGrowAmount(0);
      return;
    }
    const grow = Math.max(0, Math.min(num, pendingReward.totalAmount));
    setGrowAmount(grow);
    setError(null);
  };

  const handleExplainSplit = () => {
    setSplitExplanation(null);
    setLoadingSplitExplanation(true);
    fetch("/api/gemini/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "SPEND_VS_GROW",
        studentName,
        context: {
          totalReward: pendingReward.totalAmount,
          spendAmount,
          saveAmount,
          growAmount,
        },
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((data) => setSplitExplanation(data.explanation ?? SPEND_VS_GROW_FALLBACK))
      .catch(() => setSplitExplanation(SPEND_VS_GROW_FALLBACK))
      .finally(() => setLoadingSplitExplanation(false));
  };

  const handleSubmit = () => {
    const total = spendAmount + saveAmount + growAmount;
    if (spendAmount < 0 || saveAmount < 0 || growAmount < 0) {
      setError("Amounts cannot be negative.");
      return;
    }
    if (total !== pendingReward.totalAmount) {
      setError(`Spend + Save + Grow must equal ${pendingReward.totalAmount} tokens.`);
      return;
    }
    onClaim(spendAmount, saveAmount, growAmount);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Claim your tokens!"
    >
      <div className="space-y-6">
        <p className="text-lg text-gray-700">
          Claim your <span className="font-bold text-amber-600">{pendingReward.totalAmount}</span> tokens from{" "}
          <span className="font-bold">{pendingReward.missionTitle}</span>!
        </p>

        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-gray-800 mb-2">
            Recommended: {recommended.spend} Spend, {recommended.save} Save, {recommended.grow} Grow
          </p>
          <Button variant="secondary" onClick={handleUseRecommended} className="w-full">
            Use recommended split
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              💰 Spend tokens (use now)
            </label>
            <input
              type="number"
              min={0}
              max={pendingReward.totalAmount}
              value={spendAmount}
              onChange={(e) => handleSpendChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 font-display text-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              💾 Save tokens (set aside)
            </label>
            <input
              type="number"
              min={0}
              max={pendingReward.totalAmount}
              value={saveAmount}
              onChange={(e) => handleSaveChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 font-display text-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              🌱 Grow tokens (saves for later)
            </label>
            <input
              type="number"
              min={0}
              max={pendingReward.totalAmount}
              value={growAmount}
              onChange={(e) => handleGrowChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 font-display text-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <p className="text-sm text-gray-500">
            Total: {spendAmount + saveAmount + growAmount} / {pendingReward.totalAmount} tokens
          </p>
        </div>

        <button
          type="button"
          onClick={handleExplainSplit}
          className="text-sm font-bold text-amber-600 hover:text-amber-700 underline"
        >
          Why split like this?
        </button>
        {loadingSplitExplanation && (
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
            <span className="text-sm text-gray-500">Mrs. Pennyworth is thinking…</span>
          </div>
        )}
        {splitExplanation && !loadingSplitExplanation && (
          <p className="text-gray-700 font-medium border-l-4 border-amber-400 pl-4 py-2 bg-amber-50/80 rounded-r-xl">
            {splitExplanation}
          </p>
        )}

        {error && (
          <p className="text-red-600 font-medium text-sm">{error}</p>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSubmit}
            className="flex-1"
            disabled={spendAmount + saveAmount + growAmount !== pendingReward.totalAmount}
          >
            Claim tokens!
          </Button>
        </div>
      </div>
    </Modal>
  );
}
