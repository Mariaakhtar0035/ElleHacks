"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MissionCard } from "@/components/MissionCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { PurchaseCard } from "@/components/PurchaseCard";
import { Badge } from "@/components/ui/Badge";
import { TokenChip } from "@/components/ui/TokenChip";
import {
  getStudentMissions,
  getStudent,
  getRecommendedSplit,
  getPendingRewardsForStudent,
  getRewards,
} from "@/lib/store";
import { Mission } from "@/types";

const SPEND_VS_GROW_FALLBACK =
  "You earned tokens! Some go to Spend (use now), some to Save, and some to Grow (locked and growing).";

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

export default function ActivityPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [splitModalMission, setSplitModalMission] = useState<Mission | null>(null);
  const [splitExplanation, setSplitExplanation] = useState<string | null>(null);
  const [loadingSplitExplanation, setLoadingSplitExplanation] = useState(false);

  const student = useMemo(() => getStudent(studentId), [studentId]);
  const missions = useMemo(() => getStudentMissions(studentId), [studentId]);
  const pendingRewards = useMemo(
    () => getPendingRewardsForStudent(studentId),
    [studentId],
  );
  const rewards = useMemo(() => getRewards(), []);
  const purchasedRewardItems = useMemo(
    () =>
      student
        ? rewards.filter((r) => student.purchasedRewards.includes(r.id))
        : [],
    [student, rewards],
  );

  const handleExplainRewardSplit = (mission: Mission) => {
    setSplitModalMission(mission);
    setSplitExplanation(null);
    setLoadingSplitExplanation(true);
    const reward = mission.currentReward;
    const { spend: spendAmount, save: saveAmount, grow: growAmount } = getRecommendedSplit(reward);
    fetch("/api/gemini/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "SPEND_VS_GROW",
        studentName: student?.name ?? "Student",
        context: { totalReward: reward, spendAmount, saveAmount, growAmount },
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((data) => setSplitExplanation(data.explanation ?? SPEND_VS_GROW_FALLBACK))
      .catch(() => setSplitExplanation(SPEND_VS_GROW_FALLBACK))
      .finally(() => setLoadingSplitExplanation(false));
  };

  return (
    <div className="space-y-8">
      {pendingRewards.length > 0 && (
        <Card borderColor="border-amber-500" className="p-4 bg-amber-50">
          <p className="text-gray-700">
            You have {pendingRewards.length} reward{pendingRewards.length > 1 ? "s" : ""} to claim!
          </p>
          <Link href={`/student/${studentId}`} className="text-emerald-600 font-bold hover:underline mt-2 inline-block">
            Go to Dashboard to claim →
          </Link>
        </Card>
      )}
      <div className="text-center">
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">
          Activity
        </h1>
        <p className="text-xl text-gray-700">
          Track your missions, purchases, and activity
        </p>
      </div>

      {/* My Missions */}
      <div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
          My Missions
        </h2>
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
                studentId={studentId}
                actionHint={getActionHint(mission.status)}
                onExplainRewardSplit={handleExplainRewardSplit}
              />
            ))}
          </div>
        )}
      </div>

      {/* My Purchases */}
      <Card borderColor="border-emerald-500" className="p-8">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
          My Purchases
        </h2>
        {purchasedRewardItems.length === 0 ? (
          <p className="text-gray-600 text-center py-4">
            No purchases yet. Visit the reward shop to spend your tokens!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {purchasedRewardItems.map((reward) => (
              <PurchaseCard key={reward.id} reward={reward} />
            ))}
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card borderColor="border-gray-800" className="p-8">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
          Recent Activity
        </h2>
        {missions.length === 0 ? (
          <EmptyState
            emoji="🎯"
            title="No missions yet!"
            description="Visit the marketplace to get started and earn tokens!"
            action={
              <Link href={`/student/${studentId}/marketplace`}>
                <Button variant="primary">Go to Marketplace</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {missions.slice(0, 5).map((mission) => (
              <div
                key={mission.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-200"
              >
                <div>
                  <h3 className="font-display font-bold text-gray-900">
                    {mission.title}
                  </h3>
                  <div className="mt-1">
                    <Badge status={mission.status} />
                  </div>
                </div>
                <TokenChip
                  amount={mission.currentReward}
                  type="spend"
                  size="md"
                />
              </div>
            ))}
          </div>
        )}
      </Card>

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
