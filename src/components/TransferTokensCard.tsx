"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { Button } from "@/components/ui/Button";
import { transferTokens, type TokenBucket } from "@/lib/store";

const BUCKETS: { value: TokenBucket; label: string; icon: string }[] = [
  { value: "spend", label: "Spend", icon: "💰" },
  { value: "save", label: "Save", icon: "💾" },
  { value: "grow", label: "Grow", icon: "🌱" },
];

function getBucketLabel(bucket: TokenBucket): string {
  return BUCKETS.find((b) => b.value === bucket)?.label ?? bucket;
}

interface TransferTokensCardProps {
  studentId: string;
  studentName?: string;
  spendTokens: number;
  saveTokens: number;
  growTokens: number;
  onTransfer: () => void;
}

const TRANSFER_INSIGHT_FALLBACK =
  "Moving tokens to Grow helps them grow over time! Moving to Spend lets you use them now. It's like planting seeds vs picking fruit!";

export function TransferTokensCard({
  studentId,
  studentName = "Student",
  spendTokens,
  saveTokens,
  growTokens,
  onTransfer,
}: TransferTokensCardProps) {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState<TokenBucket>("spend");
  const [to, setTo] = useState<TokenBucket>("grow");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [transferExplanation, setTransferExplanation] = useState<string | null>(null);
  const [loadingTransferExplanation, setLoadingTransferExplanation] = useState(false);

  const balances = { spend: spendTokens, save: saveTokens, grow: growTokens };
  const maxAmount = balances[from];
  const canTransfer = from !== to && maxAmount > 0;

  const handleExplainTransfer = () => {
    setTransferExplanation(null);
    setLoadingTransferExplanation(true);
    fetch("/api/gemini/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "TRANSFER_INSIGHT",
        studentName,
        context: {},
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((data) => setTransferExplanation(data.explanation ?? TRANSFER_INSIGHT_FALLBACK))
      .catch(() => setTransferExplanation(TRANSFER_INSIGHT_FALLBACK))
      .finally(() => setLoadingTransferExplanation(false));
  };

  const handleTransfer = () => {
    setError(null);
    setSuccess(null);
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (num > maxAmount) {
      setError(`You only have ${maxAmount} ${getBucketLabel(from)} tokens.`);
      return;
    }
    const result = transferTokens(studentId, num, from, to);
    if (result) {
      setAmount("");
      setSuccess(`Moved ${num} tokens from ${getBucketLabel(from)} to ${getBucketLabel(to)}!`);
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
        We recommend putting some tokens into Save and Grow for future goals.{" "}
        <button
          type="button"
          onClick={handleExplainTransfer}
          className="text-emerald-600 hover:text-emerald-700 font-bold underline"
        >
          Why move tokens?
        </button>
      </p>
      {loadingTransferExplanation && (
        <div className="h-10 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center mb-2">
          <span className="text-sm text-gray-500">Mrs. Pennyworth is thinking…</span>
        </div>
      )}
      {transferExplanation && !loadingTransferExplanation && (
        <p className="text-gray-700 font-medium border-l-4 border-emerald-400 pl-4 py-2 bg-emerald-50/80 rounded-r-xl mb-4">
          {transferExplanation}
        </p>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Move from
          </label>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Source bucket">
            {BUCKETS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => {
                  setFrom(b.value);
                  if (to === b.value) setTo(BUCKETS.find((x) => x.value !== b.value)!.value);
                }}
                className={`px-3 py-2 rounded-lg font-display font-bold text-xs transition-all border-2 ${
                  from === b.value
                    ? b.value === "spend"
                      ? "bg-amber-500 text-white border-amber-600"
                      : b.value === "save"
                        ? "bg-sky-500 text-white border-sky-600"
                        : "bg-emerald-500 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {b.icon} {b.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Move to
          </label>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Destination bucket">
            {BUCKETS.filter((b) => b.value !== from).map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => setTo(b.value)}
                className={`px-3 py-2 rounded-lg font-display font-bold text-xs transition-all border-2 ${
                  to === b.value
                    ? b.value === "spend"
                      ? "bg-amber-500 text-white border-amber-600"
                      : b.value === "save"
                        ? "bg-sky-500 text-white border-sky-600"
                        : "bg-emerald-500 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {b.icon} {b.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Amount to move
          </label>
          <input
            type="number"
            min={1}
            max={maxAmount}
            placeholder={`Max: ${maxAmount}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 font-display focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>
        <Button
          variant={canTransfer ? "success" : "secondary"}
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
