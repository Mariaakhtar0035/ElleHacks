"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { MissionCard } from "@/components/MissionCard";
import { MissionFormModal } from "@/components/MissionFormModal";
import { RewardFormModal } from "@/components/RewardFormModal";
import { StudentFormModal } from "@/components/StudentFormModal";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { AssignMissionModal } from "@/components/AssignMissionModal";
import { StudentAvatar } from "@/components/StudentAvatar";
import { SuccessSparkle } from "@/components/SuccessSparkle";
import {
  getRecommendedSplit,
  createStudent,
  createMission,
  updateMission,
  unassignMission,
  deleteMission,
  calculateReward,
  createReward,
  updateReward,
  deleteReward,
} from "@/lib/store";
import { Mission, Reward, Student, MissionBandColor } from "@/types";

async function fetchDashboard() {
  const res = await fetch("/api/teacher/dashboard", {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json() as Promise<{
    missions: Mission[];
    students: Student[];
    rewards: Reward[];
    pendingMissions: Mission[];
  }>;
}

export default function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [pendingMissions, setPendingMissions] = useState<Mission[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showSparkle, setShowSparkle] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [missionToAssign, setMissionToAssign] = useState<Mission | null>(null);
  const [showRewardFormModal, setShowRewardFormModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [showRewardDeleteModal, setShowRewardDeleteModal] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<Reward | null>(null);
  const [showStudentFormModal, setShowStudentFormModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "missions" | "rewards" | "requests" | "students"
  >("missions");

  const refreshData = () =>
    fetchDashboard()
      .then((data) => {
        setStudents(data.students);
        setMissions(data.missions);
        setRewards(data.rewards);
        setPendingMissions(data.pendingMissions);
      })
      .catch((err) => console.error("Failed to refresh dashboard:", err));

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerSuccess = (msg: string) => {
    setMessage(msg);
    setShowSparkle(true);
    refreshData();
    setTimeout(() => setMessage(""), 4000);
    setTimeout(() => setShowSparkle(false), 1500);
  };

  const handleAssignMission = async (missionId: string, studentId: string) => {
    try {
      const res = await fetch("/api/teacher/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId, studentId }),
      });
      if (!res.ok) throw new Error("Assign failed");
      const name = students.find((s) => s.id === studentId)?.name;
      triggerSuccess(`Mission assigned to ${name}!`);
    } catch (err) {
      console.error("Failed to assign mission:", err);
    }
  };

  const handleApproveMission = async (missionId: string) => {
    try {
      const res = await fetch("/api/teacher/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId }),
      });
      if (!res.ok) throw new Error("Complete failed");
      const data = await res.json();
      triggerSuccess(
        `Mission approved! ${data.student.name} has ${data.pendingReward.totalAmount} tokens to claim.`,
      );
    } catch (err) {
      console.error("Failed to approve mission:", err);
    }
  };

  const handleFormSubmit = (data: {
    title: string;
    description: string;
    baseReward: number;
    bandColor?: MissionBandColor;
  }) => {
    if (editingMission) {
      const newReward = calculateReward(
        data.baseReward,
        editingMission.requestCount,
      );
      updateMission(editingMission.id, {
        title: data.title,
        description: data.description,
        baseReward: data.baseReward,
        currentReward: newReward,
        bandColor: data.bandColor,
      });
      triggerSuccess("Mission updated!");
    } else {
      createMission(data);
      triggerSuccess("Mission added!");
    }
    setShowFormModal(false);
    setEditingMission(null);
  };

  const handleDeleteConfirm = () => {
    if (!missionToDelete) return;
    deleteMission(missionToDelete.id);
    triggerSuccess("Mission removed.");
    setMissionToDelete(null);
    setShowDeleteModal(false);
  };

  const handleRewardFormSubmit = (data: {
    title: string;
    description: string;
    cost: number;
    icon: string;
    soldOut?: boolean;
  }) => {
    if (editingReward) {
      updateReward(editingReward.id, data);
      triggerSuccess("Reward updated!");
    } else {
      createReward(data);
      triggerSuccess("Reward added!");
    }
    setShowRewardFormModal(false);
    setEditingReward(null);
  };

  const handleStudentFormSubmit = (data: { name: string; pin?: string }) => {
    createStudent(data);
    triggerSuccess(`Student ${data.name} added!`);
    setShowStudentFormModal(false);
  };

  const handleRewardDeleteConfirm = () => {
    if (!rewardToDelete) return;
    deleteReward(rewardToDelete.id);
    triggerSuccess("Reward removed.");
    setRewardToDelete(null);
    setShowRewardDeleteModal(false);
  };

  const requestedMissions = missions.filter(
    (m) => m.requestedBy.length > 0 && !m.assignedStudentId,
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b-4 border-gray-300 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-4xl">
                🏦
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 font-display">
                Teacher Dashboard
              </h1>
            </div>
            <div className="flex gap-2">
              <Link href="/leaderboard">
                <Button variant="primary">🏆 Market Leaderboard</Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        )}
        {message && (
          <div className="bg-green-100 border-4 border-green-500 rounded-2xl p-4 text-center shadow-md">
            <p className="text-lg font-bold text-green-800 font-display">
              {message}
            </p>
          </div>
        )}

        {!loading && (
        <>
        <nav
          role="tablist"
          aria-label="Dashboard sections"
          className="flex flex-wrap gap-2 border-b-2 border-gray-200 pb-2 mb-6"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "missions"}
            aria-controls="tabpanel-missions"
            id="tab-missions"
            onClick={() => setActiveTab("missions")}
            className={`px-4 py-2 rounded-xl font-display font-bold border-2 transition-colors ${
              activeTab === "missions"
                ? "bg-amber-100 text-gray-900 border-amber-300"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Missions
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "rewards"}
            aria-controls="tabpanel-rewards"
            id="tab-rewards"
            onClick={() => setActiveTab("rewards")}
            className={`px-4 py-2 rounded-xl font-display font-bold border-2 transition-colors ${
              activeTab === "rewards"
                ? "bg-emerald-100 text-gray-900 border-emerald-300"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Rewards
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "requests"}
            aria-controls="tabpanel-requests"
            id="tab-requests"
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 rounded-xl font-display font-bold border-2 transition-colors ${
              activeTab === "requests"
                ? "bg-blue-100 text-gray-900 border-blue-300"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Requests & Approvals
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "students"}
            aria-controls="tabpanel-students"
            id="tab-students"
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-xl font-display font-bold border-2 transition-colors ${
              activeTab === "students"
                ? "bg-purple-100 text-gray-900 border-purple-300"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Students
          </button>
        </nav>

        {activeTab === "missions" && (
          <div
            role="tabpanel"
            id="tabpanel-missions"
            aria-labelledby="tab-missions"
            className="space-y-8"
          >
            {/* All Missions - CRUD */}
            <Card borderColor="border-amber-500" className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 font-display">
                  🃏 All Missions
                </h2>
                <Button
                  variant="primary"
                  onClick={() => {
                    setEditingMission(null);
                    setShowFormModal(true);
                  }}
                  className="shrink-0"
                >
                  + Add Mission
                </Button>
              </div>

              {missions.length === 0 ? (
                <p className="text-gray-600 text-center py-8 font-display">
                  No missions yet. Add one to get started!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {missions.map((mission) => {
                    const assignedStudent = mission.assignedStudentId
                      ? students.find((s) => s.id === mission.assignedStudentId)
                      : null;
                    return (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        variant="teacher"
                        assignedStudentName={assignedStudent?.name}
                        onEdit={() => {
                          setEditingMission(mission);
                          setShowFormModal(true);
                        }}
                        onDelete={() => {
                          setMissionToDelete(mission);
                          setShowDeleteModal(true);
                        }}
                        onAssign={() => {
                          // If mission is completed, unassign it instead of showing assign modal
                          if (mission.status === "COMPLETED") {
                            unassignMission(mission.id);
                            triggerSuccess(
                              `Mission "${mission.title}" reset to available!`,
                            );
                          } else {
                            setMissionToAssign(mission);
                            setShowAssignModal(true);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "rewards" && (
          <div
            role="tabpanel"
            id="tabpanel-rewards"
            aria-labelledby="tab-rewards"
            className="space-y-8"
          >
            {/* All Rewards - CRUD */}
            <Card borderColor="border-emerald-500" className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 font-display">
                  🎁 All Rewards
                </h2>
                <Button
                  variant="primary"
                  onClick={() => {
                    setEditingReward(null);
                    setShowRewardFormModal(true);
                  }}
                  className="shrink-0"
                >
                  + Add Reward
                </Button>
              </div>

              {rewards.length === 0 ? (
                <p className="text-gray-600 text-center py-8 font-display">
                  No rewards yet. Add one to get started!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="flex flex-col rounded-2xl border-2 border-gray-200 overflow-hidden bg-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <div className="p-4 flex-1 flex flex-col items-center text-center gap-2">
                        <div className="text-5xl">{reward.icon}</div>
                        <h3 className="font-display font-bold text-gray-900 text-sm line-clamp-2">
                          {reward.title}
                        </h3>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {reward.description}
                        </p>
                        <span className="font-display font-bold text-amber-800 text-sm">
                          🪙 {reward.cost} tokens
                        </span>
                        {reward.soldOut && (
                          <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                            Sold Out
                          </span>
                        )}
                        <div className="flex gap-2 mt-auto pt-2 w-full">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setEditingReward(reward);
                              setShowRewardFormModal(true);
                            }}
                            className="flex-1 text-sm py-2 border-2 border-amber-200 bg-amber-50! text-gray-800! hover:bg-amber-100! hover:border-amber-300!"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setRewardToDelete(reward);
                              setShowRewardDeleteModal(true);
                            }}
                            className="flex-1 text-sm py-2 border-2 border-red-200 bg-red-50! text-gray-800! hover:bg-red-100! hover:border-red-300!"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "requests" && (
          <div
            role="tabpanel"
            id="tabpanel-requests"
            aria-labelledby="tab-requests"
            className="space-y-8"
          >
            {/* Mission Requests */}
            <Card borderColor="border-blue-500" className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 font-display mb-6">
                📋 Mission Requests
              </h2>

              {requestedMissions.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No mission requests at the moment.
                </p>
              ) : (
                <div className="space-y-4">
                  {requestedMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="border-2 border-gray-200 rounded-2xl p-6 bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 font-display">
                              {mission.title}
                            </h3>
                            <Badge status={mission.status} />
                          </div>
                          <p className="text-gray-700 mb-3">
                            {mission.description}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-bold text-gray-700">
                              Reward:
                            </span>
                            <TokenDisplay
                              amount={mission.currentReward}
                              type="spend"
                              size="sm"
                              showLabel={false}
                            />
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-bold">Requested by:</span>{" "}
                            {mission.requestedBy
                              .map(
                                (id) => students.find((s) => s.id === id)?.name,
                              )
                              .join(", ")}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <label className="text-sm font-bold text-gray-700">
                            Assign to:
                          </label>
                          {mission.requestedBy.map((studentId) => {
                            const student = students.find(
                              (s) => s.id === studentId,
                            );
                            return (
                              <Button
                                key={studentId}
                                variant="primary"
                                onClick={() =>
                                  handleAssignMission(mission.id, studentId)
                                }
                                className="w-full"
                              >
                                {student?.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Pending Approvals */}
            <Card borderColor="border-emerald-500" className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 font-display mb-6">
                ✅ Pending Approvals
              </h2>

              {pendingMissions.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No missions pending approval.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingMissions.map((mission) => {
                    const student = students.find(
                      (s) => s.id === mission.assignedStudentId,
                    );
                    const {
                      spend: spendAmount,
                      save: saveAmount,
                      grow: growAmount,
                    } = getRecommendedSplit(mission.currentReward);
                    return (
                      <div
                        key={mission.id}
                        className="border-2 border-gray-200 rounded-2xl p-6 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="grow">
                            <h3 className="text-xl font-bold text-gray-900 font-display mb-2">
                              {mission.title}
                            </h3>
                            <p className="text-gray-700 mb-3">
                              {mission.description}
                            </p>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-bold text-gray-700">
                                  Student:
                                </span>{" "}
                                {student?.name}
                              </div>
                              <div className="text-sm">
                                <span className="font-bold text-gray-700">
                                  Reward Split:
                                </span>{" "}
                                {spendAmount} Spend + {saveAmount} Save +{" "}
                                {growAmount} Grow tokens
                              </div>
                            </div>
                          </div>
                          <div>
                            <Button
                              variant="success"
                              onClick={() => handleApproveMission(mission.id)}
                            >
                              Approve & Award Tokens
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "students" && (
          <div
            role="tabpanel"
            id="tabpanel-students"
            aria-labelledby="tab-students"
            className="space-y-8"
          >
            {/* Student Overview */}
            <Card borderColor="border-purple-500" className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 font-display">
                  👥 Student Overview
                </h2>
                <Button
                  variant="primary"
                  onClick={() => setShowStudentFormModal(true)}
                  className="shrink-0"
                >
                  + Add Student
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {students.map((student) => {
                  const studentMissions = missions.filter(
                    (m) => m.assignedStudentId === student.id,
                  );
                  const completedCount = studentMissions.filter(
                    (m) => m.status === "COMPLETED",
                  ).length;
                  const purchasedRewardItems = rewards.filter((r) =>
                    student.purchasedRewards.includes(r.id),
                  );
                  return (
                    <Card
                      key={student.id}
                      borderColor="border-gray-300"
                      className="p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="text-center mb-4">
                        <div className="flex justify-center mb-2">
                          <StudentAvatar
                            studentId={student.id}
                            studentName={student.name}
                            size="md"
                          />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 font-display">
                          {student.name}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-700">
                            Spend:
                          </span>
                          <TokenDisplay
                            amount={student.spendTokens}
                            type="spend"
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-700">
                            Save:
                          </span>
                          <TokenDisplay
                            amount={student.saveTokens}
                            type="save"
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-700">
                            Grow:
                          </span>
                          <TokenDisplay
                            amount={student.growTokens}
                            type="grow"
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                        <div className="pt-3 border-t-2 border-gray-200">
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-bold">Missions:</span>{" "}
                            {completedCount} completed
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-700 mb-1">
                              Purchases ({student.purchasedRewards.length}):
                            </div>
                            {purchasedRewardItems.length === 0 ? (
                              <p className="text-xs text-gray-500">None yet</p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {purchasedRewardItems.map((reward) => (
                                  <span
                                    key={reward.id}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-gray-800"
                                  >
                                    <span>{reward.icon}</span>
                                    <span>{reward.title}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
        </>
        )}

      </main>

      <MissionFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingMission(null);
        }}
        mission={editingMission}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setMissionToDelete(null);
        }}
        title="Remove this mission?"
        message="This mission will be removed permanently. Students will no longer see it."
        onConfirm={handleDeleteConfirm}
        confirmLabel="Remove Mission"
      />

      <RewardFormModal
        isOpen={showRewardFormModal}
        onClose={() => {
          setShowRewardFormModal(false);
          setEditingReward(null);
        }}
        reward={editingReward}
        onSubmit={handleRewardFormSubmit}
      />

      <StudentFormModal
        isOpen={showStudentFormModal}
        onClose={() => setShowStudentFormModal(false)}
        onSubmit={handleStudentFormSubmit}
      />

      <ConfirmDeleteModal
        isOpen={showRewardDeleteModal}
        onClose={() => {
          setShowRewardDeleteModal(false);
          setRewardToDelete(null);
        }}
        title="Remove this reward?"
        message="This reward will be removed from the shop. Students who already bought it will keep it."
        onConfirm={handleRewardDeleteConfirm}
        confirmLabel="Remove Reward"
      />

      {missionToAssign && (
        <AssignMissionModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setMissionToAssign(null);
          }}
          missionTitle={missionToAssign.title}
          missionId={missionToAssign.id}
          students={students}
          assignedStudentId={missionToAssign.assignedStudentId}
          onAssign={handleAssignMission}
        />
      )}

      <SuccessSparkle
        show={showSparkle}
        onComplete={() => setShowSparkle(false)}
        duration={1500}
      />
    </div>
  );
}
