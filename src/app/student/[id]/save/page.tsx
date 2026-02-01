"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { getStudent } from "@/lib/store";

const SAVE_GOAL = 200;

export default function SaveTokensPage() {
  const params = useParams();
  const studentId = params.id as string;
  const student = getStudent(studentId);
  if (!student) return null;

  const progress = Math.min(100, Math.round((student.saveTokens / SAVE_GOAL) * 100));
  const remaining = Math.max(0, SAVE_GOAL - student.saveTokens);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">
          💾 Save Tokens
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
        <p className="text-center text-gray-600 mb-4">
          Goal: {SAVE_GOAL} Save tokens
        </p>
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
