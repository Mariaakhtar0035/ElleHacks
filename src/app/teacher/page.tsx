"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { MissionFormModal } from "@/components/MissionFormModal";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { AssignMissionModal } from "@/components/AssignMissionModal";
import { SuccessSparkle } from "@/components/SuccessSparkle";
import {
  getStudents,
  getMissions,
  assignMission,
  unassignMission,
  completeMission,
  getPendingApprovalMissions,
  createMission,
  updateMission,
  deleteMission,
  calculateReward,
} from "@/lib/store";
import { Mission, MissionBandColor } from "@/types";

const BAND_CLASSES: Record<MissionBandColor, string> = {
  red: "bg-red-400",
  green: "bg-green-500",
  blue: "bg-blue-500",
  amber: "bg-amber-400",
  orange: "bg-orange-400",
  purple: "bg-purple-500",
  sky: "bg-sky-400",
  brown: "bg-amber-700",
};

function getBandColorKey(mission: Mission): MissionBandColor {
  const colors: MissionBandColor[] = ["red", "green", "blue", "amber", "orange", "purple", "sky", "brown"];
  if (mission.bandColor) return mission.bandColor;
  let hash = 0;
  for (let i = 0; i < mission.id.length; i++) {
    hash = (hash << 5) - hash + mission.id.charCodeAt(i);
    hash |= 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function TeacherDashboard() {
  const [students, setStudents] = useState(getStudents());
  const [missions, setMissions] = useState(getMissions());
  const [pendingMissions, setPendingMissions] = useState(getPendingApprovalMissions());
  const [message, setMessage] = useState("");
  const [showSparkle, setShowSparkle] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [missionToAssign, setMissionToAssign] = useState<Mission | null>(null);

  const refreshData = () => {
    setStudents(getStudents());
    setMissions(getMissions());
    setPendingMissions(getPendingApprovalMissions());
  };

  const triggerSuccess = (msg: string) => {
    setMessage(msg);
    setShowSparkle(true);
    refreshData();
    setTimeout(() => setMessage(""), 4000);
    setTimeout(() => setShowSparkle(false), 1500);
  };

  const handleAssignMission = (missionId: string, studentId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (mission?.assignedStudentId && mission.assignedStudentId !== studentId) {
      unassignMission(missionId);
    }
    const result = assignMission(missionId, studentId);
    if (result) {
      const name = students.find((s) => s.id === studentId)?.name;
      triggerSuccess(`Mission assigned to ${name}!`);
    }
  };

  const handleApproveMission = (missionId: string) => {
    const result = completeMission(missionId);
    if (result) {
      const spendAmount = Math.floor(result.mission.currentReward * 0.7);
      const growAmount = Math.floor(result.mission.currentReward * 0.3);
      triggerSuccess(
        `Mission approved! ${result.student.name} earned ${spendAmount} Spend + ${growAmount} Grow tokens.`
      );
    }
  };

  const handleFormSubmit = (data: {
    title: string;
    description: string;
    baseReward: number;
    bandColor?: MissionBandColor;
  }) => {
    if (editingMission) {
      const newReward = calculateReward(data.baseReward, editingMission.requestCount);
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

  const requestedMissions = missions.filter(
    (m) => m.requestedBy.length > 0 && !m.assignedStudentId
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
            <Link href="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {message && (
          <div className="bg-green-100 border-4 border-green-500 rounded-2xl p-4 text-center shadow-md">
            <p className="text-lg font-bold text-green-800 font-display">{message}</p>
          </div>
        )}

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
                const bandKey = getBandColorKey(mission);
                const assignedStudent = mission.assignedStudentId
                  ? students.find((s) => s.id === mission.assignedStudentId)
                  : null;
                return (
                  <div
                    key={mission.id}
                    className="flex flex-col rounded-[20px] border-4 border-gray-800 overflow-hidden bg-[#faf8f5] shadow-[4px_4px_0_rgba(0,0,0,0.12)] transition-all hover:shadow-[6px_6px_0_rgba(0,0,0,0.18)] hover:-translate-y-0.5"
                  >
                    <div
                      className={`min-h-[20%] shrink-0 px-4 py-3 flex items-center justify-center rounded-t-[16px] ${BAND_CLASSES[bandKey]} text-white`}
                    >
                      <span className="font-display font-bold text-sm uppercase tracking-wider text-center line-clamp-2">
                        {mission.title}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      <p className="text-gray-700 text-sm line-clamp-2">{mission.description}</p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-bold text-amber-800 text-sm">
                          🪙 {mission.currentReward} tokens
                        </span>
                        <Badge status={mission.status} />
                      </div>
                      {assignedStudent && (
                        <p className="text-xs text-gray-600">
                          Assigned to: <span className="font-bold">{assignedStudent.name}</span>
                        </p>
                      )}
                      <div className="flex gap-2 mt-auto pt-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingMission(mission);
                            setShowFormModal(true);
                          }}
                          className="flex-1 text-sm py-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            setMissionToDelete(mission);
                            setShowDeleteModal(true);
                          }}
                          className="flex-1 text-sm py-2"
                        >
                          Delete
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            setMissionToAssign(mission);
                            setShowAssignModal(true);
                          }}
                          className="flex-1 text-sm py-2"
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

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
                      <p className="text-gray-700 mb-3">{mission.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-gray-700">Reward:</span>
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
                          .map((id) => students.find((s) => s.id === id)?.name)
                          .join(", ")}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <label className="text-sm font-bold text-gray-700">Assign to:</label>
                      {mission.requestedBy.map((studentId) => {
                        const student = students.find((s) => s.id === studentId);
                        return (
                          <Button
                            key={studentId}
                            variant="primary"
                            onClick={() => handleAssignMission(mission.id, studentId)}
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
                const student = students.find((s) => s.id === mission.assignedStudentId);
                const spendAmount = Math.floor(mission.currentReward * 0.7);
                const growAmount = Math.floor(mission.currentReward * 0.3);
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
                        <p className="text-gray-700 mb-3">{mission.description}</p>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-bold text-gray-700">Student:</span>{" "}
                            {student?.name}
                          </div>
                          <div className="text-sm">
                            <span className="font-bold text-gray-700">Reward Split:</span>{" "}
                            {spendAmount} Spend + {growAmount} Grow tokens
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

        {/* Student Overview */}
        <Card borderColor="border-purple-500" className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 font-display mb-6">
            👥 Student Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {students.map((student) => {
              const studentMissions = missions.filter((m) => m.assignedStudentId === student.id);
              const completedCount = studentMissions.filter((m) => m.status === "COMPLETED").length;
              return (
                <Card key={student.id} borderColor="border-gray-300" className="p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-2">
                      {student.id === "alex" && "👦"}
                      {student.id === "jordan" && "👧"}
                      {student.id === "sam" && "🧒"}
                      {!["alex", "jordan", "sam"].includes(student.id) && "👤"}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 font-display">
                      {student.name}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">Spend:</span>
                      <TokenDisplay
                        amount={student.spendTokens}
                        type="spend"
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">Grow:</span>
                      <TokenDisplay
                        amount={student.growTokens}
                        type="grow"
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                    <div className="pt-3 border-t-2 border-gray-200">
                      <div className="text-sm text-gray-600">
                        <span className="font-bold">Missions:</span> {completedCount} completed
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-bold">Rewards:</span>{" "}
                        {student.purchasedRewards.length} purchased
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
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
