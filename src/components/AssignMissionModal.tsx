"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { StudentAvatar } from "@/components/StudentAvatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Student } from "@/types";

interface AssignMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionTitle: string;
  missionId: string;
  students: Student[];
  assignedStudentId?: string;
  onAssign: (missionId: string, studentId: string) => void;
}

export function AssignMissionModal({
  isOpen,
  onClose,
  missionTitle,
  missionId,
  students,
  assignedStudentId,
  onAssign,
}: AssignMissionModalProps) {
  const assignedStudent = assignedStudentId
    ? students.find((s) => s.id === assignedStudentId)
    : null;

  const handleAssign = (studentId: string) => {
    onAssign(missionId, studentId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Mission">
      <div className="space-y-5">
        <p className="font-display font-bold text-gray-800">
          Mission: <span className="uppercase tracking-wide">{missionTitle}</span>
        </p>

        {assignedStudent && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-700">Assigned to:</span>
            <Badge type="assigned" label={assignedStudent.name} />
            <span className="text-xs text-gray-500">Click a student below to reassign.</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Assign to student:</label>
          <div className="space-y-2">
            {students.map((student) => {
              const isAssigned = assignedStudentId === student.id;
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => handleAssign(student.id)}
                  className={`
                    w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2
                    font-display font-bold text-left transition-all
                    hover:-translate-y-0.5 hover:shadow-md
                    ${isAssigned ? "border-emerald-500 bg-emerald-50" : "border-gray-300 bg-white hover:border-blue-400"}
                  `}
                >
                  <span className="flex items-center gap-2">
                    <StudentAvatar
                      studentId={student.id}
                      studentName={student.name}
                      size="sm"
                      className="w-8 h-8 text-sm"
                    />
                    <span>{student.name}</span>
                  </span>
                  {isAssigned && (
                    <span className="text-emerald-600 font-bold text-sm">✓ Assigned</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <Button variant="secondary" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  );
}
