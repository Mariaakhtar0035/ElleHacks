"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PendingReward } from "@/types";
import { getRecommendedSplit } from "@/lib/store";

interface ClaimRewardModalProps {
  pendingReward: PendingReward;
  onClaim: (spendAmount: number, growAmount: number) => void;
  onClose: () => void;
}

export function ClaimRewardModal({
  pendingReward,
  onClaim,
  onClose,
}: ClaimRewardModalProps) {
  const recommended = getRecommendedSplit(pendingReward.totalAmount);
  const [spendAmount, setSpendAmount] = useState(recommended.spend);
  const [growAmount, setGrowAmount] = useState(recommended.grow);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSpendAmount(recommended.spend);
    setGrowAmount(recommended.grow);
  }, [pendingReward.id, recommended.spend, recommended.grow]);

  const handleUseRecommended = () => {
    setSpendAmount(recommended.spend);
    setGrowAmount(recommended.grow);
    setError(null);
  };

  const handleSpendChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || value === "") {
      setSpendAmount(0);
      setGrowAmount(pendingReward.totalAmount);
      return;
    }
    const spend = Math.max(0, Math.min(num, pendingReward.totalAmount));
    setSpendAmount(spend);
    setGrowAmount(pendingReward.totalAmount - spend);
    setError(null);
  };

  const handleGrowChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || value === "") {
      setGrowAmount(0);
      setSpendAmount(pendingReward.totalAmount);
      return;
    }
    const grow = Math.max(0, Math.min(num, pendingReward.totalAmount));
    setGrowAmount(grow);
    setSpendAmount(pendingReward.totalAmount - grow);
    setError(null);
  };

  const handleSubmit = () => {
    const total = spendAmount + growAmount;
    if (spendAmount < 0 || growAmount < 0) {
      setError("Amounts cannot be negative.");
      return;
    }
    if (total !== pendingReward.totalAmount) {
      setError(`Spend + Grow must equal ${pendingReward.totalAmount} tokens.`);
      return;
    }
    onClaim(spendAmount, growAmount);
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
            Recommended: {recommended.spend} Spend, {recommended.grow} Grow
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
            Total: {spendAmount + growAmount} / {pendingReward.totalAmount} tokens
          </p>
        </div>

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
            disabled={spendAmount + growAmount !== pendingReward.totalAmount}
          >
            Claim tokens!
          </Button>
        </div>
      </div>
    </Modal>
  );
}
