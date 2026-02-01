"use client";

import { useEffect, useState } from "react";
import { Mission } from "@/types";
import { MarketLeaderboard } from "@/components/MarketLeaderboard";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function LeaderboardPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const router = useRouter();

  const fetchLeaderboardData = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setRefreshing(true);
      }
      const res = await fetch("/api/teacher/leaderboard");
      const data = await res.json();
      setMissions(data.missions || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();

    // Auto-refresh every 3 seconds
    const interval = setInterval(() => {
      fetchLeaderboardData(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading market data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              🏆 Classroom Market Leaderboard
            </h1>
            <p className="text-gray-600">
              Track how supply and demand affects mission prices in real-time
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`w-2 h-2 rounded-full ${refreshing ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              ></div>
              <p className="text-sm text-gray-500">
                {refreshing
                  ? "Updating..."
                  : `Last updated: ${lastUpdate.toLocaleTimeString()}`}
              </p>
              <button
                onClick={() => fetchLeaderboardData(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline ml-2"
              >
                Refresh now
              </button>
            </div>
          </div>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="hidden md:block"
          >
            ← Back
          </Button>
        </div>

        {/* Leaderboard Component */}
        <MarketLeaderboard missions={missions} />

        {/* Mobile Back Button */}
        <div className="mt-6 md:hidden">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full"
          >
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
}
