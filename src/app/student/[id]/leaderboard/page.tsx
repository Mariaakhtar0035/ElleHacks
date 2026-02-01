"use client";

import { useEffect, useState } from "react";
import { Mission } from "@/types";
import { MarketLeaderboard } from "@/components/MarketLeaderboard";

export default function StudentLeaderboardPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

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
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading market data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
        <div
          className={`w-2 h-2 rounded-full ${refreshing ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
        ></div>
        <p className="text-sm text-gray-600">
          {refreshing
            ? "Updating prices..."
            : `Last updated: ${lastUpdate.toLocaleTimeString()}`}
        </p>
        <button
          onClick={() => fetchLeaderboardData(true)}
          className="text-sm text-blue-600 hover:text-blue-800 underline ml-auto"
        >
          Refresh now
        </button>
      </div>
      <MarketLeaderboard missions={missions} />
    </div>
  );
}
