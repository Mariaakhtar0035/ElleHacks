"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { getStudents } from "@/lib/store";

function scrollToChoosePlayer() {
  document.getElementById("choose-player")?.scrollIntoView({ behavior: "smooth" });
}

const FEATURES = [
  {
    title: "Mission Cards",
    description: "Complete fun tasks, earn rewards, and collect mission cards like a real board game.",
    icon: "🃏",
    bandColor: "bg-red-600",
  },
  {
    title: "Spend & Grow Tokens",
    description: "Earn Spend tokens for rewards and Grow tokens that multiply over time.",
    icon: "🪙",
    bandColor: "bg-amber-400",
  },
  {
    title: "Teacher-Assigned Missions",
    description: "Your teacher picks missions for you. Complete them and get approved to earn tokens!",
    icon: "👩‍🏫",
    bandColor: "bg-blue-800",
  },
  {
    title: "AI-Powered Insights",
    description: "Get friendly tips and explanations about saving, spending, and how money grows.",
    icon: "✨",
    bandColor: "bg-purple-600",
  },
];

export default function HomePage() {
  const students = getStudents();

  return (
    <div className="min-h-screen landing-board">
      {/* ========== HERO ========== */}
      <section className="relative px-4 pt-14 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-14">
          <div className="text-center md:text-left md:max-w-xl">
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-5 md:mb-6 leading-tight tracking-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-500 via-orange-500 to-rose-500">
                Classroomopoly!
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 font-medium leading-relaxed max-w-md">
              Complete missions, earn tokens, and watch your money grow!
            </p>
            <Button
              variant="primary"
              onClick={scrollToChoosePlayer}
              className="text-lg px-8 py-3.5 rounded-xl shadow-lg token-spin-hover w-full sm:w-auto"
            >
              Join the Game
            </Button>
          </div>
          <div className="flex justify-center items-center gap-8 md:gap-10">
            <div className="dice-bounce text-5xl md:text-6xl opacity-90" aria-hidden>
              🎲
            </div>
            <div className="token-spin-hover text-5xl md:text-6xl" aria-hidden>
              🪙
            </div>
            <div className="dice-bounce text-5xl md:text-6xl opacity-80" aria-hidden style={{ animationDelay: "0.5s" }}>
              🏠
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES (Property-card style) ========== */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Play the game. Earn tokens. Learn how money works.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="landing-card-hover flex flex-col rounded-2xl border-2 border-gray-200 overflow-hidden bg-white shadow-lg min-h-[220px]"
              >
                <div
                  className={`min-h-[28%] shrink-0 px-4 py-3.5 flex items-center justify-center rounded-t-2xl ${feature.bandColor} text-white`}
                >
                  <span className="font-display font-bold text-sm uppercase tracking-wider text-center">
                    {feature.title}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col items-center text-center">
                  <span className="text-4xl mb-3" aria-hidden>
                    {feature.icon}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== GAMIFICATION SECTION ========== */}
      <section className="px-4 py-16 md:py-24 bg-linear-to-b from-amber-50/80 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 text-center mb-4">
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
                Complete missions and get Spend + Grow tokens. Use them in the reward shop!
              </p>
            </div>
            <div className="landing-card-hover rounded-2xl border-2 border-blue-200 bg-blue-50/80 p-6 text-center shadow-lg">
              <div className="text-5xl mb-3">📈</div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Grow Your Vault</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Put tokens in Grow and watch them increase over time—like real savings.
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
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 text-center mb-4">
            Choose Your Player
          </h2>
          <p className="text-xl text-gray-700 text-center mb-12">
            Pick your character and join the game!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/student/${student.id}`}
                className="landing-card-hover block"
              >
                <Card
                  borderColor="border-blue-200"
                  className="p-8 text-center h-full"
                >
                  <div className="text-7xl mb-4">
                    {student.id === "alex" && "👦"}
                    {student.id === "jordan" && "👧"}
                    {student.id === "sam" && "🧒"}
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
            <span>Classroomopoly</span>
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
