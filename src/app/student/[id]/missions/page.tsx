"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MissionCard } from "@/components/MissionCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { getStudentMissions, getStudent } from "@/lib/store";
import { Mission } from "@/types";

const SPEND_VS_GROW_FALLBACK =
  "You earned tokens! 70% goes to Spend (use now) and 30% goes to Grow (saves for later).";

function getActionHint(status: string): string | undefined {
  switch (status) {
    case "IN_PROGRESS":
      return "Complete this mission, then ask your teacher to approve it!";
    case "COMPLETED":
      return "Tokens earned";
    case "REQUESTED":
      return "Waiting for teacher to assign";
    default:
      return undefined;
  }
}

export default function MyMissionsPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [missions] = useState(getStudentMissions(studentId));
  const [splitModalMission, setSplitModalMission] = useState<Mission | null>(null);
  const [splitExplanation, setSplitExplanation] = useState<string | null>(null);
  const [loadingSplitExplanation, setLoadingSplitExplanation] = useState(false);

  const student = getStudent(studentId);

  const handleExplainRewardSplit = (mission: Mission) => {
    setSplitModalMission(mission);
    setSplitExplanation(null);
    setLoadingSplitExplanation(true);
    const reward = mission.currentReward;
    const spendAmount = Math.floor(reward * 0.7);
    const growAmount = Math.floor(reward * 0.3);
    fetch("/api/gemini/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "SPEND_VS_GROW",
        studentName: student?.name ?? "Student",
        context: { totalReward: reward, spendAmount, growAmount },
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((data) => setSplitExplanation(data.explanation ?? SPEND_VS_GROW_FALLBACK))
      .catch(() => setSplitExplanation(SPEND_VS_GROW_FALLBACK))
      .finally(() => setLoadingSplitExplanation(false));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">
          📋 My Missions
        </h1>
        <p className="text-xl text-gray-700">
          Track your assigned missions
        </p>
      </div>

      {missions.length === 0 ? (
        <EmptyState
          emoji="🎲"
          title="No missions yet!"
          description="Visit the marketplace to request missions. Your teacher will assign them to you."
          action={
            <Link href={`/student/${studentId}/marketplace`}>
              <Button variant="primary">Go to Marketplace</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              variant="myMission"
              actionHint={getActionHint(mission.status)}
              onExplainRewardSplit={handleExplainRewardSplit}
            />
          ))}
        </div>
      )}

      {splitModalMission && (
        <Modal
          isOpen={!!splitModalMission}
          onClose={() => setSplitModalMission(null)}
          title="How was my reward split?"
        >
          {loadingSplitExplanation ? (
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center mb-6">
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          ) : splitExplanation ? (
            <p className="text-lg text-gray-700 mb-6">{splitExplanation}</p>
          ) : null}
          <Button onClick={() => setSplitModalMission(null)} className="w-full">
            Got it!
          </Button>
        </Modal>
      )}
    </div>
  );
}
