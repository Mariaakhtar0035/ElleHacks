"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { StudentAvatar } from "@/components/StudentAvatar";
import { getStudents } from "@/lib/store";
import { useEffect, useState } from "react";
import SuccessMoneySprinkle from "@/components/SuccessMoneySprinkle";

function scrollToChoosePlayer() {
  document.getElementById("choose-player")?.scrollIntoView({ behavior: "smooth" });
}

/** green, dark blue, light blue, red, yellow, orange, brown, purple */
const FEATURE_COLORS = [
  "bg-green-100 text-black",
  "bg-blue-800 text-white",
  "bg-sky-200 text-black",
  "bg-red-100 text-black",
  "bg-amber-100 text-black",
  "bg-orange-100 text-black",
  "bg-amber-200 text-black",
  "bg-purple-100 text-black",
] as const;

const FEATURES = [
  {
    title: "Mission Cards",
    description: "Complete fun tasks, earn rewards, and collect mission cards like a real board game.",
    icon: "🃏",
  },
  {
    title: "Spend, Save & Grow Tokens",
    description: "Earn Spend tokens for rewards, Save tokens for goals, and Grow tokens that multiply over time.",
    icon: "🪙",
  },
  {
    title: "Teacher-Assigned Missions",
    description: "Your teacher picks missions for you. Complete them and get approved to earn tokens!",
    icon: "👩‍🏫",
  },
  {
    title: "AI-Powered Insights",
    description: "Get friendly tips and explanations about saving, spending, and how money grows.",
    icon: "✨",
  },
];

export default function HomePage() {
  const students = getStudents();
  const [showSprinkle, setShowSprinkle] = useState(true);

  return (
    <div className="min-h-screen landing-board">
      {showSprinkle && <SuccessMoneySprinkle />}

      {/* ========== HERO ========== */}
      <section className="relative px-4 pt-14 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-14">
          <div className="text-center md:text-left md:max-w-2xl">
            <h1 className="font-display font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gray-900 mb-6 md:mb-7 leading-tight tracking-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 via-orange-500 to-rose-500">
                Finity!
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-10 font-medium leading-relaxed max-w-xl">
              Complete missions, earn tokens, and watch your money grow!
            </p>
            <Button
              variant="primary"
              onClick={scrollToChoosePlayer}
              className="text-xl px-10 py-4 rounded-xl shadow-lg token-spin-hover w-full sm:w-auto"
            >
              Join the Game
            </Button>
          </div>
          <div className="flex justify-center items-center">
            <img 
              src="/hero-placeholder.png" 
              alt="Finity hero illustration" 
              className="dice-bounce token-spin-hover w-[32rem] h-[32rem] md:w-[36rem] md:h-[36rem] object-contain"
            />
          </div>
        </div>
      </section>

      {/* ========== FEATURES (Flat print-style cards) ========== */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold uppercase text-3xl md:text-4xl text-gray-900 text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Play the game. Earn tokens. Learn how money works.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="flex flex-col min-h-[220px] w-full border-2 border-black bg-white"
              >
                {/* Inner double-border panel */}
                <div className="flex flex-col flex-1 min-h-0 m-1 border border-black bg-white">
                  {/* Header - muted pastel, thick black bottom border */}
                  <div
                    className={`shrink-0 px-4 py-3 border-b-2 border-black ${FEATURE_COLORS[index % FEATURE_COLORS.length]}`}
                  >
                    <div className="text-center font-bold uppercase text-sm tracking-wide leading-tight">
                      {feature.title}
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex-1 flex flex-col min-h-0 p-4 border-b border-black">
                    <div className="flex justify-between items-start gap-4 text-sm">
                      <span className="uppercase font-bold shrink-0">About</span>
                      <span className="text-right font-normal">{feature.description}</span>
                    </div>
                  </div>
                  {/* Center emphasis - icon */}
                  <div className="py-6 px-4 text-center border-b-2 border-black bg-white">
                    <span className="text-4xl" aria-hidden>
                      {feature.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== GAMIFICATION SECTION ========== */}
      <section className="px-4 py-16 md:py-24 bg-linear-to-b from-amber-50/80 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold uppercase text-3xl md:text-4xl text-gray-900 text-center mb-4">
            Play the Economy
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Tokens, rewards, and growth—all in one game.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="landing-card-hover rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-6 text-center shadow-lg">
              <div className="text-5xl mb-3">🏆</div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Earn Tokens</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Complete missions and get Spend + Save + Grow tokens. Use them in the reward shop!
              </p>
            </div>
            <div className="landing-card-hover rounded-2xl border-2 border-blue-200 bg-blue-50/80 p-6 text-center shadow-lg">
              <div className="text-5xl mb-3">📈</div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Grow Your Vault</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Put tokens in Save and Grow to watch them build over time—like real savings.
              </p>
            </div>
            <div className="landing-card-hover rounded-2xl border-2 border-emerald-200 bg-emerald-50/80 p-6 text-center shadow-lg">
              <div className="text-5xl mb-3">✅</div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Complete & Collect</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Finish missions, get teacher approval, and unlock rewards. Simple and fun!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CHOOSE YOUR PLAYER (CTA target) ========== */}
      <section id="choose-player" className="px-4 py-16 md:py-24 scroll-mt-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-bold uppercase text-3xl md:text-4xl text-gray-900 text-center mb-4">
            Choose Your Player
          </h2>
          <p className="text-xl text-gray-700 text-center mb-12">
            Pick your character and join the game!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/student/${student.id}/login`}
                className="landing-card-hover block"
              >
                <Card
                  borderColor="border-blue-200"
                  className="p-8 text-center h-full"
                >
                  <div className="flex justify-center mb-4">
                    <StudentAvatar
                      studentId={student.id}
                      studentName={student.name}
                      size="lg"
                      palette="pastel"
                    />
                  </div>
                  <h3 className="font-display font-bold text-3xl text-gray-900 mb-6">
                    {student.name}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <TokenDisplay
                        amount={student.spendTokens}
                        type="spend"
                        size="sm"
                      />
                    </div>
                    <div className="flex justify-center">
                      <TokenDisplay
                        amount={student.saveTokens}
                        type="save"
                        size="sm"
                      />
                    </div>
                    <div className="flex justify-center">
                      <TokenDisplay
                        amount={student.growTokens}
                        type="grow"
                        size="sm"
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="px-4 py-10 border-t border-gray-200 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-700 font-display font-bold">
            <span className="text-2xl">🃏</span>
            <span>Finity</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/teacher/login"
              className="px-3 py-2 -m-2 text-sm font-display font-bold text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors rounded-lg hover:bg-gray-100/80"
            >
              Teacher Login
            </Link>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4 max-w-6xl mx-auto">
          A fun financial learning game for kids. Complete missions, earn tokens, and learn how money grows!
        </p>
      </footer>
    </div>
  );
}
