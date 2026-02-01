"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MissionCard } from "@/components/MissionCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SuccessSparkle } from "@/components/SuccessSparkle";
import { getAvailableMissions, requestMission, getStudent } from "@/lib/store";
import type { Mission } from "@/types";

const SUPPLY_DEMAND_FALLBACK =
  "When lots of students want the same mission, the reward goes down. It's like when a popular toy costs less when there's lots of it!";

export default function MarketplacePage() {
  const params = useParams();
  const studentId = params.id as string;
  const [missions, setMissions] = useState(getAvailableMissions());
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [rewardAdjusted, setRewardAdjusted] = useState(false);
  const [supplyDemandExplanation, setSupplyDemandExplanation] = useState<string | null>(null);
  const [loadingSupplyDemand, setLoadingSupplyDemand] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  // Pre-request "Why less?" modal (when student clicks before requesting)
  const [priceDropModalMission, setPriceDropModalMission] = useState<Mission | null>(null);
  const [priceDropExplanation, setPriceDropExplanation] = useState<string | null>(null);
  const [loadingPriceDropExplanation, setLoadingPriceDropExplanation] = useState(false);

  const handleRequestMission = (missionId: string) => {
    const result = requestMission(studentId, missionId);

    if (result) {
      setShowSparkle(true);
      setMissions(getAvailableMissions());
      const adjusted = result.currentReward !== result.baseReward || result.requestCount > 1;
      setRewardAdjusted(adjusted);
      setSupplyDemandExplanation(null);

      setModalMessage(
        adjusted
          ? `Mission requested! Reward adjusted to ${result.currentReward} tokens.`
          : `Mission requested! You'll get ${result.currentReward} tokens when your teacher assigns and approves this mission.`
      );
      setShowModal(true);

      if (adjusted) {
        const studentName = getStudent(studentId)?.name ?? "Student";
        setLoadingSupplyDemand(true);
        fetch("/api/gemini/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "SUPPLY_DEMAND",
            studentName,
            context: {
              baseReward: result.baseReward,
              currentReward: result.currentReward,
              requestCount: result.requestCount,
            },
          }),
        })
          .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
          .then((data) => setSupplyDemandExplanation(data.explanation ?? SUPPLY_DEMAND_FALLBACK))
          .catch(() => setSupplyDemandExplanation(SUPPLY_DEMAND_FALLBACK))
          .finally(() => setLoadingSupplyDemand(false));
      }
    } else {
      setRewardAdjusted(false);
      setSupplyDemandExplanation(null);
      setModalMessage("You've already requested this mission!");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSupplyDemandExplanation(null);
    setLoadingSupplyDemand(false);
  };

  const handleExplainPriceDrop = (mission: Mission) => {
    setPriceDropModalMission(mission);
    setPriceDropExplanation(null);
    setLoadingPriceDropExplanation(true);
    const studentName = getStudent(studentId)?.name ?? "Student";
    fetch("/api/gemini/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "SUPPLY_DEMAND",
        studentName,
        context: {
          baseReward: mission.baseReward,
          currentReward: mission.currentReward,
          requestCount: mission.requestCount,
        },
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((data) => setPriceDropExplanation(data.explanation ?? SUPPLY_DEMAND_FALLBACK))
      .catch(() => setPriceDropExplanation(SUPPLY_DEMAND_FALLBACK))
      .finally(() => setLoadingPriceDropExplanation(false));
  };

  const closePriceDropModal = () => {
    setPriceDropModalMission(null);
    setPriceDropExplanation(null);
    setLoadingPriceDropExplanation(false);
  };

  const availableMissions = missions.filter(m => !m.assignedStudentId);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">
          Mission Marketplace
        </h1>
        <p className="text-xl text-gray-700">
          Request missions to earn tokens!
        </p>
      </div>

      {availableMissions.length === 0 ? (
        <EmptyState
          emoji="🎲"
          title="No missions yet! Check back soon"
          description="All missions are taken right now. Roll the dice and come back later for new opportunities!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              studentId={studentId}
              onRequest={handleRequestMission}
              onExplainPriceDrop={handleExplainPriceDrop}
            />
          ))}
        </div>
      )}

      <SuccessSparkle show={showSparkle} onComplete={() => setShowSparkle(false)} />

      <Modal isOpen={showModal} onClose={closeModal} title="Mission Request">
        <p className="text-lg text-gray-700 mb-4">{modalMessage}</p>
        {rewardAdjusted && (
          <div className="mb-6">
            {loadingSupplyDemand ? (
              <div className="h-12 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
                <span className="text-sm text-gray-500">Loading explanation...</span>
              </div>
            ) : supplyDemandExplanation ? (
              <p className="text-gray-700 font-medium border-l-4 border-amber-400 pl-4 py-2 bg-amber-50/80 rounded-r-xl">
                {supplyDemandExplanation}
              </p>
            ) : null}
          </div>
        )}
        <Button onClick={closeModal} className="w-full">
          Got it!
        </Button>
      </Modal>

      <Modal
        isOpen={!!priceDropModalMission}
        onClose={closePriceDropModal}
        title="Why is the reward less?"
      >
        {loadingPriceDropExplanation ? (
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center mb-6">
            <span className="text-sm text-gray-500">Mrs. Pennyworth is thinking…</span>
          </div>
        ) : priceDropExplanation ? (
          <p className="text-lg text-gray-700 mb-6 border-l-4 border-amber-400 pl-4 py-2 bg-amber-50/80 rounded-r-xl">
            {priceDropExplanation}
          </p>
        ) : null}
        <Button onClick={closePriceDropModal} className="w-full">
          Got it!
        </Button>
      </Modal>
    </div>
  );
}
