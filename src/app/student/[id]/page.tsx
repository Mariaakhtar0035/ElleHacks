"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/EmptyState";
import { getStudent, getStudentMissions } from "@/lib/store";
import { TokenChip } from "@/components/ui/TokenChip";

export default function StudentDashboard() {
  const params = useParams();
  const studentId = params.id as string;
  const student = getStudent(studentId);
  const missions = getStudentMissions(studentId);

  if (!student) return null;

  const completedMissions = missions.filter((m) => m.status === "COMPLETED");
  const totalEarned = student.spendTokens + student.growTokens;

  return (
    <div className="space-y-8">
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

        <Card borderColor="border-blue-500" className="p-6 relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">🌱</span>
            <h3 className="font-display font-bold text-xl text-gray-800">
              Grow Tokens
            </h3>
            <span
              className="text-lg ml-auto"
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

      {/* Quick Actions */}
      <Card borderColor="border-amber-400" className="p-8">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link href={`/student/${studentId}/marketplace`}>
            <Button variant="primary">🏪 Browse Missions</Button>
          </Link>
          <Link href={`/student/${studentId}/shop`}>
            <Button variant="success">🎁 Visit Reward Shop</Button>
          </Link>
          <Link href={`/student/${studentId}/grow`}>
            <Button variant="secondary">📈 See Growth Projection</Button>
          </Link>
        </div>
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
                  <p className="text-sm text-gray-600">{mission.status}</p>
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
