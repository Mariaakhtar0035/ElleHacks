"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { TokenChip } from "@/components/ui/TokenChip";
import { Modal } from "@/components/ui/Modal";
import { SuccessSparkle } from "@/components/SuccessSparkle";
import { getRewards, getStudent, purchaseReward } from "@/lib/store";

export default function RewardShopPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const [student, setStudent] = useState(getStudent(studentId));
  const rewards = getRewards();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [showSparkle, setShowSparkle] = useState(false);

  if (!student) return null;

  const handlePurchase = (rewardId: string) => {
    const result = purchaseReward(studentId, rewardId);

    if (result) {
      setShowSparkle(true);
      setStudent(result.student);
      setModalTitle("Purchase Successful! 🎉");
      setModalMessage(
        `You bought ${result.reward.title}! You now have ${result.student.spendTokens} Spend tokens left.`
      );
      setShowModal(true);

      setTimeout(() => {
        router.refresh();
      }, 100);
    } else {
      const reward = rewards.find((r) => r.id === rewardId);
      if (reward?.soldOut) {
        setModalTitle("Sold Out!");
        setModalMessage(
          "Sorry, this reward is currently sold out. Check back later!"
        );
      } else {
        setModalTitle("Not Enough Tokens!");
        setModalMessage(
          "You don't have enough Spend tokens for this reward. Complete more missions to earn tokens!"
        );
      }
      setShowModal(true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">
          Reward Shop
        </h1>
        <p className="text-xl text-gray-700">
          Spend your tokens on awesome game perks!
        </p>
      </div>

      {/* Current Balance */}
      <Card borderColor="border-amber-500" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-gray-800 mb-2">
              Your Spend Tokens
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              Available to spend now
            </p>
          </div>
          <TokenDisplay
            amount={student.spendTokens}
            type="spend"
            size="lg"
            showLabel={false}
          />
        </div>
      </Card>

      {/* Rewards Grid - collectible items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.map((reward) => {
          const canAfford = student.spendTokens >= reward.cost;
          const alreadyPurchased = student.purchasedRewards.includes(reward.id);

          return (
            <Card
              key={reward.id}
              borderColor={
                reward.soldOut
                  ? "border-gray-400"
                  : canAfford
                  ? "border-emerald-500"
                  : "border-amber-400"
              }
              className={`p-6 relative overflow-hidden ${reward.soldOut ? "opacity-75" : ""}`}
            >
              {/* Sold Out diagonal banner */}
              {reward.soldOut && (
                <div
                  className="absolute top-4 right-4 -rotate-12 bg-red-500 text-white font-display font-bold text-lg px-4 py-2 rounded-lg shadow-md border-2 border-red-700"
                  aria-label="Sold out"
                >
                  SOLD OUT
                </div>
              )}

              <div className="text-center mb-4">
                <div className="text-7xl mb-3">{reward.icon}</div>
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
                  {reward.title}
                </h3>
                <p className="text-gray-700 mb-4">{reward.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
                  <span className="font-display font-bold text-gray-700 mr-3">
                    Cost:
                  </span>
                  <TokenChip amount={reward.cost} type="spend" size="md" />
                </div>

                {reward.soldOut ? (
                  <div className="text-center py-3 bg-gray-200 rounded-2xl border-2 border-gray-300">
                    <span className="font-display font-bold text-gray-600">
                      😔 Sold Out
                    </span>
                  </div>
                ) : alreadyPurchased ? (
                  <div className="text-center py-3 bg-emerald-100 rounded-2xl border-2 border-emerald-300">
                    <span className="font-display font-bold text-emerald-800">
                      ✓ Already Purchased
                    </span>
                  </div>
                ) : (
                  <>
                    <Button
                      variant={canAfford ? "success" : "secondary"}
                      onClick={() => handlePurchase(reward.id)}
                      disabled={!canAfford}
                      className="w-full"
                    >
                      {canAfford ? "BUY" : "Not Enough Tokens"}
                    </Button>
                    {!canAfford && (
                      <div className="text-center py-2 px-3 bg-red-50 rounded-xl border-2 border-red-200">
                        <span className="font-display font-bold text-red-700 text-sm">
                          NOT ENOUGH TOKENS
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          You need {reward.cost - student.spendTokens} more
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card borderColor="border-purple-500" className="p-6 bg-purple-50">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
              Remember!
            </h3>
            <p className="text-gray-700">
              You can only spend your Spend tokens. Your Grow tokens are locked
              and growing for your future! Complete more missions to earn
              tokens.
            </p>
          </div>
        </div>
      </Card>

      <SuccessSparkle show={showSparkle} onComplete={() => setShowSparkle(false)} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
      >
        <p className="text-lg text-gray-700 mb-6">{modalMessage}</p>
        <Button onClick={() => setShowModal(false)} className="w-full">
          Got it!
        </Button>
      </Modal>
    </div>
  );
}
