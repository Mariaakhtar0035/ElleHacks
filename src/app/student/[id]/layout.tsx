"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { NarratorBanner } from "@/components/NarratorBanner";
import { AskNarratorModal } from "@/components/AskNarratorModal";
import { getStudent, getStudentMissions, getAvailableMissions } from "@/lib/store";
import { NarratorPage } from "@/types";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const studentId = params.id as string;
  const student = getStudent(studentId);

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student not found
          </h1>
          <Link href="/" className="text-blue-500 underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: `/student/${studentId}`, label: "Dashboard", icon: "🏠" },
    { href: `/student/${studentId}/marketplace`, label: "Marketplace", icon: "🏪" },
    { href: `/student/${studentId}/missions`, label: "My Missions", icon: "📋" },
    { href: `/student/${studentId}/grow`, label: "Grow Tokens", icon: "📈" },
    { href: `/student/${studentId}/shop`, label: "Reward Shop", icon: "🎁" },
  ];

  // Determine current page for narrator
  const getPage = (): NarratorPage => {
    if (pathname.endsWith("/marketplace")) return "marketplace";
    if (pathname.endsWith("/missions")) return "missions";
    if (pathname.endsWith("/grow")) return "grow";
    if (pathname.endsWith("/shop")) return "shop";
    return "dashboard";
  };

  const currentPage = getPage();
  const studentMissions = getStudentMissions(studentId);
  const availableMissions = getAvailableMissions();
  const [showAskModal, setShowAskModal] = useState(false);

  const avatarEmoji = student.id === "alex" ? "👦" : student.id === "jordan" ? "👧" : "🧒";

  return (
    <div className="min-h-screen">
      {/* Player nameplate header */}
      <header className="bg-white/95 backdrop-blur-sm rounded-b-2xl border-b border-x border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-4xl hover:scale-105 transition-transform" aria-label="Home">
                🏦
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-200 to-amber-400 border-2 border-amber-400/60 flex items-center justify-center text-2xl shadow-md">
                  {avatarEmoji}
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl md:text-2xl text-gray-900">
                    {student.name}&apos;s Board
                  </h1>
                  <p className="text-sm text-gray-500">Your game dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <div className="bg-amber-50/90 rounded-xl border border-amber-200 px-4 py-2 shadow-sm">
                <TokenDisplay amount={student.spendTokens} type="spend" size="sm" />
              </div>
              <div className="bg-blue-50/90 rounded-xl border border-blue-200 px-4 py-2 relative shadow-sm" title="Locked and growing! You can't spend these yet.">
                <TokenDisplay amount={student.growTokens} type="grow" size="sm" showLock />
              </div>
              <button
                type="button"
                onClick={() => setShowAskModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-violet-300 bg-violet-50 font-display font-bold text-violet-700 hover:bg-violet-100 hover:border-violet-400 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <span aria-hidden>🎙️</span>
                <span>Ask the Narrator</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation - game tiles */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 py-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-blue-500 text-white border-blue-500 shadow-md"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <NarratorBanner
          studentName={student.name}
          page={currentPage}
          spendTokens={student.spendTokens}
          growTokens={student.growTokens}
          missionCount={studentMissions.length}
          availableMissions={availableMissions.length}
        />
        {children}
      </main>

      <AskNarratorModal
        isOpen={showAskModal}
        onClose={() => setShowAskModal(false)}
        studentName={student.name}
      />
    </div>
  );
}
