"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { TokenDisplay } from "@/components/ui/TokenDisplay";
import { StudentAvatar } from "@/components/StudentAvatar";
import { MrsPennyworthPanel } from "@/components/MrsPennyworthPanel";
import { MrsPennyworthAvatar } from "@/components/MrsPennyworthAvatar";
import {
  getStudent,
  getStudentMissions,
  getAvailableMissions,
  getMissions,
  getRewards,
} from "@/lib/store";
import { NarratorPage } from "@/types";

const SESSION_KEY = "student_session";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const studentId = params.id as string;
  const student = getStudent(studentId);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [showPennyworthPanel, setShowPennyworthPanel] = useState(false);

  const isLoginPage = pathname.endsWith("/login");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isLoginPage) {
      const session = localStorage.getItem(SESSION_KEY);
      if (session !== studentId) {
        router.replace(`/student/${studentId}/login`);
        return;
      }
    }
    setSessionChecked(true);
  }, [isLoginPage, studentId, router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
  };

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

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-[#d2e5d2] flex items-center justify-center">
        <div className="animate-pulse text-gray-600 font-display font-bold">
          Loading...
        </div>
      </div>
    );
  }

  const navItems = [
    { href: `/student/${studentId}`, label: "Dashboard", icon: "🏠" },
    {
      href: `/student/${studentId}/marketplace`,
      label: "Marketplace",
      icon: "🏪",
    },
    {
      href: `/student/${studentId}/missions`,
      label: "My Missions",
      icon: "📋",
    },
    { href: `/student/${studentId}/grow`, label: "Grow Tokens", icon: "📈" },
    { href: `/student/${studentId}/save`, label: "Save Tokens", icon: "💰" },
    { href: `/student/${studentId}/shop`, label: "Reward Shop", icon: "🎁" },
    { href: `/student/${studentId}/leaderboard`, label: "Market", icon: "🏆" },
  ];

  // Determine current page for narrator
  const getPage = (): NarratorPage => {
    if (pathname.endsWith("/marketplace")) return "marketplace";
    if (pathname.endsWith("/missions")) return "missions";
    if (pathname.endsWith("/grow")) return "grow";
    if (pathname.endsWith("/save")) return "save";
    if (pathname.endsWith("/shop")) return "shop";
    if (pathname.endsWith("/leaderboard")) return "marketplace"; // Treat leaderboard as marketplace context
    return "dashboard";
  };

  const currentPage = getPage();
  const studentMissions = getStudentMissions(studentId);
  const availableMissions = getAvailableMissions();
  const allMissions = getMissions();
  const allRewards = getRewards();
  const completedMissions = allMissions.filter(
    (m) => m.assignedStudentId === studentId && m.status === "COMPLETED",
  );
  const purchasedRewardItems = allRewards.filter((r) =>
    student.purchasedRewards.includes(r.id),
  );
  const askNarratorContext = {
    spendTokens: student.spendTokens,
    saveTokens: student.saveTokens,
    growTokens: student.growTokens,
    currentPage,
    assignedMissionsCount: studentMissions.length,
    assignedMissionTitles: studentMissions.map((m) => m.title),
    completedMissionTitles: completedMissions.slice(-3).map((m) => m.title),
    purchasedRewardsCount: student.purchasedRewards.length,
    purchasedRewardTitles: purchasedRewardItems.map((r) => r.title),
    availableMissionsCount: availableMissions.length,
    availableMissions: availableMissions.map((m) => ({
      title: m.title,
      reward: m.currentReward,
    })),
    availableRewards: allRewards
      .filter((r) => !r.soldOut)
      .map((r) => ({ title: r.title, cost: r.cost })),
  };

  return (
    <div className="min-h-screen">
      {/* Player nameplate header */}
      <header className="bg-white/95 backdrop-blur-sm rounded-b-2xl border-b border-x border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                onClick={handleLogout}
                className="text-4xl hover:scale-105 transition-transform"
                aria-label="Home"
              >
                🏦
              </Link>
              <div className="flex items-center gap-3">
                <StudentAvatar
                  studentId={student.id}
                  studentName={student.name}
                  size="sm"
                  className="w-12 h-12 text-xl"
                />
                <div>
                  <h1 className="font-display font-bold text-xl md:text-2xl text-gray-900">
                    {student.name}&apos;s Board
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <div className="bg-amber-50/90 rounded-xl border border-amber-200 px-4 py-2 shadow-sm">
                <TokenDisplay
                  amount={student.spendTokens}
                  type="spend"
                  size="sm"
                />
              </div>
              <div className="bg-sky-50/90 rounded-xl border border-sky-200 px-4 py-2 shadow-sm">
                <TokenDisplay
                  amount={student.saveTokens}
                  type="save"
                  size="sm"
                />
              </div>
              <div
                className="bg-blue-50/90 rounded-xl border border-blue-200 px-4 py-2 relative shadow-sm"
                title="Locked and growing! You can't spend these yet."
              >
                <TokenDisplay
                  amount={student.growTokens}
                  type="grow"
                  size="sm"
                  showLock
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPennyworthPanel((prev) => !prev)}
                className="
                  flex items-center gap-2 px-5 py-2.5
                  rounded-full
                  border-2 border-teal-300 bg-teal-50
                  font-display font-bold text-teal-800
                  hover:bg-teal-100 hover:border-teal-400
                  hover:scale-105 hover:shadow-md
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2
                "
                aria-label="Ask Mrs. Pennyworth"
                aria-expanded={showPennyworthPanel}
              >
                <span className="shrink-0" aria-hidden>
                  <MrsPennyworthAvatar state="idle" size="sm" />
                </span>
                <span>Ask Mrs. Pennyworth 💬</span>
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
        {children}
      </main>

      <MrsPennyworthPanel
        isOpen={showPennyworthPanel}
        onClose={() => setShowPennyworthPanel(false)}
        onToggle={() => setShowPennyworthPanel((prev) => !prev)}
        studentName={student.name}
        context={askNarratorContext}
      />
    </div>
  );
}
