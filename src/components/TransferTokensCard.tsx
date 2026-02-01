"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { Button } from "@/components/ui/Button";
import { transferTokens } from "@/lib/store";

interface TransferTokensCardProps {
  studentId: string;
  spendTokens: number;
  growTokens: number;
  onTransfer: () => void;
}

export function TransferTokensCard({
  studentId,
  spendTokens,
  growTokens,
  onTransfer,
}: TransferTokensCardProps) {
  const [toGrowAmount, setToGrowAmount] = useState("");
  const [toSpendAmount, setToSpendAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleMoveToGrow = () => {
    setError(null);
    setSuccess(null);
    const amount = parseInt(toGrowAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (amount > spendTokens) {
      setError(`You only have ${spendTokens} Spend tokens.`);
      return;
    }
    const result = transferTokens(studentId, amount, "toGrow");
    if (result) {
      setToGrowAmount("");
      setSuccess(`Moved ${amount} tokens to Grow!`);
      onTransfer();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError("Could not transfer. Try again.");
    }
  };

  const handleMoveToSpend = () => {
    setError(null);
    setSuccess(null);
    const amount = parseInt(toSpendAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (amount > growTokens) {
      setError(`You only have ${growTokens} Grow tokens.`);
      return;
    }
    const result = transferTokens(studentId, amount, "toSpend");
    if (result) {
      setToSpendAmount("");
      setSuccess(`Moved ${amount} tokens to Spend!`);
      onTransfer();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError("Could not transfer. Try again.");
    }
  };

  return (
    <Card borderColor="border-emerald-500" className="p-6 bg-emerald-50">
      <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
        Move Tokens
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        We recommend putting about 30% in Grow for long-term growth!
      </p>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Move to Grow
            </label>
            <input
              type="number"
              min={1}
              max={spendTokens}
              placeholder={`Max: ${spendTokens}`}
              value={toGrowAmount}
              onChange={(e) => setToGrowAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 font-display focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <Button
            variant="success"
            onClick={handleMoveToGrow}
            disabled={spendTokens === 0 || !toGrowAmount}
          >
            🌱 To Grow
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Move to Spend
            </label>
            <input
              type="number"
              min={1}
              max={growTokens}
              placeholder={`Max: ${growTokens}`}
              value={toSpendAmount}
              onChange={(e) => setToSpendAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 font-display focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <Button
            variant="secondary"
            onClick={handleMoveToSpend}
            disabled={growTokens === 0 || !toSpendAmount}
          >
            💰 To Spend
          </Button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <TokenDisplay amount={spendTokens} type="spend" size="sm" showLabel={false} />
          <span className="text-gray-600">Spend</span>
        </div>
        <div className="flex items-center gap-2">
          <TokenDisplay amount={growTokens} type="grow" size="sm" showLabel={false} />
          <span className="text-gray-600">Grow</span>
        </div>
      </div>
      {error && <p className="mt-3 text-red-600 font-medium text-sm">{error}</p>}
      {success && <p className="mt-3 text-emerald-600 font-medium text-sm">{success}</p>}
    </Card>
  );
}
