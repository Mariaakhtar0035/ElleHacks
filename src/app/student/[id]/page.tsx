"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { Button } from "@/components/ui/Button";
import { ClaimRewardModal } from "@/components/ClaimRewardModal";
import {
  getStudent,
  getStudentMissions,
  getRewards,
  getPendingRewardsForStudent,
  claimPendingReward,
  getBalanceHistory,
} from "@/lib/store";
import { TransferTokensCard } from "@/components/TransferTokensCard";
import { GrowthComparisonChart } from "@/components/GrowthComparisonChart";
import { SpendingBehaviorCard } from "@/components/SpendingBehaviorCard";
import { computeWhatIfGrow } from "@/lib/growthCalculator";
import type { PendingReward } from "@/types";

export default function StudentDashboard() {
  const params = useParams();
  const studentId = params.id as string;
  const [claimingPending, setClaimingPending] = useState<PendingReward | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((r) => r + 1);

  const student = useMemo(() => getStudent(studentId), [studentId, refreshKey]);
  const missions = useMemo(
    () => getStudentMissions(studentId),
    [studentId, refreshKey],
  );
  const pendingRewards = useMemo(
    () => getPendingRewardsForStudent(studentId),
    [studentId, refreshKey],
  );

  const handleClaim = (
    spendAmount: number,
    saveAmount: number,
    growAmount: number,
  ) => {
    if (!claimingPending) return;
    claimPendingReward(claimingPending.id, spendAmount, saveAmount, growAmount);
    setClaimingPending(null);
    refresh();
  };

  if (!student) return null;

  const completedMissions = missions.filter((m) => m.status === "COMPLETED");
  const totalEarned =
    student.spendTokens + student.saveTokens + student.growTokens;
  const history = getBalanceHistory(studentId);
  const whatIfGrow = computeWhatIfGrow(history);
  const rewards = getRewards();
  const purchasedRewardItems = rewards.filter((r) =>
    student.purchasedRewards.includes(r.id),
  );
  const availableRewards = rewards
    .filter((r) => !r.soldOut && !student.purchasedRewards.includes(r.id))
    .slice(0, 5)
    .map((r) => ({ title: r.title, cost: r.cost }));

  return (
    <div className="space-y-8">
      {/* Pending claim banner */}
      {pendingRewards.length > 0 && (
        <Card borderColor="border-amber-500" className="p-6 bg-amber-50">
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">
            🎉 You have tokens to claim!
          </h2>
          <p className="text-gray-700 mb-4">
            Your teacher approved {pendingRewards.length} mission
            {pendingRewards.length > 1 ? "s" : ""}. Choose how to split your
            tokens between Spend (use now) and Grow (save for later).
          </p>
          <div className="space-y-3">
            {pendingRewards.map((pending) => (
              <div
                key={pending.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white border-2 border-amber-200"
              >
                <div>
                  <h3 className="font-display font-bold text-gray-900">
                    {pending.missionTitle}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {pending.totalAmount} tokens to claim
                  </p>
                </div>
                <Button
                  variant="success"
                  onClick={() => setClaimingPending(pending)}
                >
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
          studentName={student.name}
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

        <Card
          borderColor="border-blue-500"
          className="p-6 relative text-center"
        >
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
          <TokenDisplay
            amount={student.growTokens}
            type="grow"
            size="lg"
            showLabel={false}
            showLock={false}
          />
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

      {/* Mrs. Pennyworth's Spending Insights */}
      <SpendingBehaviorCard
        studentId={studentId}
        studentName={student.name}
        history={history}
        purchasedRewardItems={purchasedRewardItems}
        currentSpend={student.spendTokens}
        currentSave={student.saveTokens}
        currentGrow={student.growTokens}
        saveGoal={student.saveGoal}
        availableRewards={availableRewards}
      />

      {/* Your Money Story - Spend vs Grow chart with Time Machine toggle */}
      <Card borderColor="border-gray-800" className="p-8 overflow-hidden">
        <GrowthComparisonChart history={history} whatIfGrow={whatIfGrow} />
      </Card>

      {/* Move Tokens - anytime transfer */}
      <TransferTokensCard
        studentId={studentId}
        studentName={student.name}
        spendTokens={student.spendTokens}
        saveTokens={student.saveTokens}
        growTokens={student.growTokens}
        onTransfer={refresh}
      />
    </div>
  );
}
