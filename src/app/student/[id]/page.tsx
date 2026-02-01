"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/EmptyState";
import { ClaimRewardModal } from "@/components/ClaimRewardModal";
import { getStudent, getStudentMissions, getRewards, getPendingRewardsForStudent, claimPendingReward } from "@/lib/store";
import { TokenChip } from "@/components/ui/TokenChip";
import { Badge } from "@/components/ui/Badge";
import type { PendingReward } from "@/types";

export default function StudentDashboard() {
  const params = useParams();
  const studentId = params.id as string;
  const [claimingPending, setClaimingPending] = useState<PendingReward | null>(null);
  const [, setRefresh] = useState(0);
  const refresh = () => setRefresh((r) => r + 1);

  const student = getStudent(studentId);
  const missions = getStudentMissions(studentId);
  const pendingRewards = getPendingRewardsForStudent(studentId);

  const handleClaim = (spendAmount: number, growAmount: number) => {
    if (!claimingPending) return;
    claimPendingReward(claimingPending.id, spendAmount, growAmount);
    setClaimingPending(null);
    refresh();
  };

  if (!student) return null;

  const completedMissions = missions.filter((m) => m.status === "COMPLETED");
  const totalEarned = student.spendTokens + student.growTokens;
  const rewards = getRewards();
  const purchasedRewardItems = rewards.filter((r) =>
    student.purchasedRewards.includes(r.id)
  );

  return (
    <div className="space-y-8">
      {/* Pending claim banner */}
      {pendingRewards.length > 0 && (
        <Card borderColor="border-amber-500" className="p-6 bg-amber-50">
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
            🎉 You have tokens to claim!
          </h2>
          <p className="text-gray-700 mb-4">
            Your teacher approved {pendingRewards.length} mission{pendingRewards.length > 1 ? "s" : ""}. Choose how to split your tokens between Spend (use now) and Grow (save for later).
          </p>
          <div className="space-y-3">
            {pendingRewards.map((pending) => (
              <div
                key={pending.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white border-2 border-amber-200"
              >
                <div>
                  <h3 className="font-display font-bold text-gray-900">{pending.missionTitle}</h3>
                  <p className="text-sm text-gray-600">{pending.totalAmount} tokens to claim</p>
                </div>
                <Button variant="success" onClick={() => setClaimingPending(pending)}>
                  Claim tokens!
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {claimingPending && (
        <ClaimRewardModal
          pendingReward={claimingPending}
          onClaim={handleClaim}
          onClose={() => setClaimingPending(null)}
        />
      )}

      {/* Game board tiles - token balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card borderColor="border-amber-500" className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">🪙</span>
            <h3 className="font-display font-bold text-xl text-gray-800">
              Spend Tokens
            </h3>
          </div>
          <TokenDisplay
            amount={student.spendTokens}
            type="spend"
            size="lg"
            showLabel={false}
          />
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Available to spend now!
          </p>
        </Card>

        <Card borderColor="border-blue-500" className="p-6 relative text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-3xl">🌱</span>
            <h3 className="font-display font-bold text-xl text-gray-800">
              Grow Tokens
            </h3>
            <span
              className="text-lg"
              title="Locked and growing! You can't spend these yet."
            >
              🔒
            </span>
          </div>
          <div className="flex justify-center">
            <TokenDisplay
              amount={student.growTokens}
              type="grow"
              size="lg"
              showLabel={false}
              showLock={false}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 font-medium gentle-pulse">
            Locked & growing!
          </p>
        </Card>

        <Card borderColor="border-purple-500" className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">🏆</span>
            <h3 className="font-display font-bold text-xl text-gray-800">
              Missions Completed
            </h3>
          </div>
          <div className="font-display font-bold text-4xl text-purple-600">
            {completedMissions.length}
          </div>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            Total earned: {totalEarned} tokens
          </p>
        </Card>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {purchasedRewardItems.map((reward) => (
              <div
                key={reward.id}
                className="flex flex-col items-center p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200"
              >
                <span className="text-4xl mb-2">{reward.icon}</span>
                <span className="font-display font-bold text-gray-900 text-center text-sm">
                  {reward.title}
                </span>
              </div>
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
                <TokenChip amount={mission.currentReward} type="spend" size="md" />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
