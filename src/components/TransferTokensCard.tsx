"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { Button } from "@/components/ui/Button";
import { transferTokens } from "@/lib/store";

type Direction = "toGrow" | "toSpend";

interface TransferTokensCardProps {
  studentId: string;
  spendTokens: number;
  saveTokens: number;
  growTokens: number;
  onTransfer: () => void;
}

export function TransferTokensCard({
  studentId,
  spendTokens,
  saveTokens,
  growTokens,
  onTransfer,
}: TransferTokensCardProps) {
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<Direction>("toGrow");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const maxAmount = direction === "toGrow" ? spendTokens : growTokens;
  const canTransfer = direction === "toGrow" ? spendTokens > 0 : growTokens > 0;

  const handleTransfer = () => {
    setError(null);
    setSuccess(null);
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (num > maxAmount) {
      setError(`You only have ${maxAmount} ${direction === "toGrow" ? "Spend" : "Grow"} tokens.`);
      return;
    }
    const result = transferTokens(studentId, num, direction);
    if (result) {
      setAmount("");
      setSuccess(`Moved ${num} tokens ${direction === "toGrow" ? "to Grow" : "to Spend"}!`);
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
        We recommend putting some tokens into Save and Grow for future goals.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Amount to move
          </label>
          <div className="flex gap-2 items-stretch">
            <input
              type="number"
              min={1}
              max={maxAmount}
              placeholder={`Max: ${maxAmount}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 min-w-0 px-4 py-2 rounded-xl border-2 border-gray-300 font-display focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
            <div
              className="flex gap-1 shrink-0"
              role="tablist"
              aria-label="Move tokens to Grow or Spend"
            >
              <button
                type="button"
                role="tab"
                aria-selected={direction === "toGrow"}
                onClick={() => setDirection("toGrow")}
                className={`px-3 py-2 rounded-lg font-display font-bold text-xs transition-all border-2 ${
                  direction === "toGrow"
                    ? "bg-emerald-500 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400"
                }`}
              >
                🌱 Grow
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={direction === "toSpend"}
                onClick={() => setDirection("toSpend")}
                className={`px-3 py-2 rounded-lg font-display font-bold text-xs transition-all border-2 ${
                  direction === "toSpend"
                    ? "bg-amber-500 text-white border-amber-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-amber-400"
                }`}
              >
                💰 Spend
              </button>
            </div>
          </div>
        </div>
        <Button
          variant={direction === "toGrow" ? "success" : "secondary"}
          onClick={handleTransfer}
          disabled={!canTransfer || !amount}
          className="w-full py-2 text-sm"
        >
          Submit
        </Button>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TokenDisplay amount={spendTokens} type="spend" size="sm" showLabel={false} />
            <span className="text-gray-600">Spend</span>
          </div>
          <div className="flex items-center gap-2">
            <TokenDisplay amount={saveTokens} type="save" size="sm" showLabel={false} />
            <span className="text-gray-600">Save</span>
          </div>
          <div className="flex items-center gap-2">
            <TokenDisplay amount={growTokens} type="grow" size="sm" showLabel={false} />
            <span className="text-gray-600">Grow</span>
          </div>
        </div>
        {error && <p className="mt-3 text-red-600 font-medium text-sm">{error}</p>}
        {success && <p className="mt-3 text-emerald-600 font-medium text-sm">{success}</p>}
      </div>
    </Card>
  );
}
