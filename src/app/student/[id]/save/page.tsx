"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { Button } from "@/components/ui/Button";
import { getStudent, updateStudent } from "@/lib/store";

const DEFAULT_SAVE_GOAL = 200;

export default function SaveTokensPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [, setRefresh] = useState(0);
  const refresh = () => setRefresh((r) => r + 1);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editValue, setEditValue] = useState("");

  const student = getStudent(studentId);
  if (!student) return null;

  const saveGoal = student.saveGoal ?? DEFAULT_SAVE_GOAL;
  const progress = Math.min(100, Math.round((student.saveTokens / saveGoal) * 100));
  const remaining = Math.max(0, saveGoal - student.saveTokens);

  const handleStartEdit = () => {
    setEditValue(String(saveGoal));
    setIsEditingGoal(true);
  };

  const handleSaveGoal = () => {
    const num = parseInt(editValue, 10);
    if (!isNaN(num) && num >= 1 && num <= 9999) {
      updateStudent(studentId, { saveGoal: num });
      setIsEditingGoal(false);
      setEditValue("");
      refresh();
    }
  };

  const handleCancelEdit = () => {
    setIsEditingGoal(false);
    setEditValue("");
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">
          💰 Save Tokens
        </h1>
        <p className="text-xl text-gray-700">
          Saving helps you reach goals a little at a time.
        </p>
      </div>

      <Card borderColor="border-sky-500" className="p-6 text-center">
        <div className="flex justify-center mb-3">
          <TokenDisplay amount={student.saveTokens} type="save" size="lg" showLabel={false} />
        </div>
        <p className="text-sm text-gray-600 font-medium">
          These are your set‑aside tokens for future goals.
        </p>
      </Card>

      <Card borderColor="border-emerald-500" className="p-6">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-3 text-center">
          🎯 Save Goal
        </h2>
        {isEditingGoal ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <label htmlFor="save-goal-input" className="sr-only">
              Save goal amount
            </label>
            <input
              id="save-goal-input"
              type="number"
              min={1}
              max={9999}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-24 px-3 py-2 border-2 border-emerald-300 rounded-xl text-center font-display font-bold text-gray-900"
            />
            <span className="text-gray-600">Save tokens</span>
            <div className="flex gap-2">
              <Button variant="success" onClick={handleSaveGoal}>
                Save
              </Button>
              <Button variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <p className="text-center text-gray-600">
              Goal: {saveGoal} Save tokens
            </p>
            <Button variant="secondary" onClick={handleStartEdit} className="px-3 py-1.5 text-sm">
              Edit goal
            </Button>
          </div>
        )}
        <div className="h-6 w-full bg-emerald-100 rounded-full overflow-hidden border border-emerald-200">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
            aria-label={`Save goal progress ${progress}%`}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-3">
          {progress}% complete • {remaining} tokens to go
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card borderColor="border-amber-400" className="p-6">
          <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Start Small</h3>
          <p className="text-gray-700 text-sm">
            Even saving a few tokens each time adds up fast.
          </p>
        </Card>
        <Card borderColor="border-blue-400" className="p-6">
          <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Name Your Goal</h3>
          <p className="text-gray-700 text-sm">
            Pick something exciting to save for—it makes waiting easier.
          </p>
        </Card>
        <Card borderColor="border-purple-400" className="p-6">
          <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Save First</h3>
          <p className="text-gray-700 text-sm">
            Put a little in Save before spending the rest.
          </p>
        </Card>
      </div>

      <Card borderColor="border-gray-800" className="p-6 bg-gray-50">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">
          Mrs. Pennyworth’s Tip
        </h2>
        <p className="text-gray-700">
          “Saving is like planting a tiny seed. Keep planting, and soon you’ll have a whole garden!”
        </p>
      </Card>
    </div>
  );
}
