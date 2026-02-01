"use client";

import React, { useMemo } from "react";
import { Mission } from "@/types";
import { Card } from "@/components/ui/Card";

interface MissionStats {
  mission: Mission;
  priceDropPercent: number;
  priceChange: number;
}

interface MarketLeaderboardProps {
  missions: Mission[];
}

export function MarketLeaderboard({ missions }: MarketLeaderboardProps) {
  // Use useMemo to recalculate when missions prop changes
  const missionStats: MissionStats[] = useMemo(() => {
    return missions.map((mission) => {
      const priceChange = mission.baseReward - mission.currentReward;
      const priceDropPercent =
        mission.baseReward > 0 ? (priceChange / mission.baseReward) * 100 : 0;

      return {
        mission,
        priceDropPercent,
        priceChange,
      };
    });
  }, [missions]);

  // Sort by request count (most requested first)
  const sortedByDemand = useMemo(() => {
    return [...missionStats].sort(
      (a, b) => b.mission.requestCount - a.mission.requestCount,
    );
  }, [missionStats]);

  // Sort by biggest price drop
  const sortedByDrop = useMemo(() => {
    return [...missionStats].sort(
      (a, b) => b.priceDropPercent - a.priceDropPercent,
    );
  }, [missionStats]);

  // Calculate market statistics
  const { totalMissions, requestedMissions, totalRequests, avgRequestsPerMission, mostRequestedMission } = useMemo(() => {
    const totalMissions = missions.length;
    const requestedMissions = missions.filter(m => m.requestCount > 0).length;
    const totalRequests = missions.reduce((sum, m) => sum + m.requestCount, 0);
    const avgRequestsPerMission =
      requestedMissions > 0 ? totalRequests / requestedMissions : 0;
    const mostRequestedMission = sortedByDemand[0]?.mission;

    return { totalMissions, requestedMissions, totalRequests, avgRequestsPerMission, mostRequestedMission };
  }, [missions, sortedByDemand]);

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-2xl font-bold mb-4 text-purple-900">
          📊 Classroom Market Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Requested Missions</p>
            <p className="text-2xl font-bold text-purple-700">
              {requestedMissions}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Requests</p>
            <p className="text-2xl font-bold text-blue-700">{totalRequests}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Avg. Requests/Mission</p>
            <p className="text-2xl font-bold text-green-700">
              {avgRequestsPerMission.toFixed(1)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Hottest Mission</p>
            <p className="text-lg font-bold text-red-700 truncate">
              {mostRequestedMission?.title.slice(0, 15) || "N/A"}...
            </p>
          </div>
        </div>
      </Card>

      {/* Most Requested Missions */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          🔥 Most Requested Missions (High Demand)
        </h3>
        <div className="space-y-3">
          {sortedByDemand.slice(0, 5).map((stat, index) => (
            <div
              key={stat.mission.id}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-orange-200"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {stat.mission.title}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {stat.mission.description}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-sm text-gray-600">
                  {stat.mission.requestCount}{" "}
                  {stat.mission.requestCount === 1 ? "request" : "requests"}
                </div>
                <div className="text-lg font-bold text-orange-700">
                  {stat.mission.currentReward} 🪙
                </div>
                {stat.priceChange > 0 && (
                  <div className="text-xs text-red-600">
                    ↓ {stat.priceChange} tokens (
                    {stat.priceDropPercent.toFixed(0)}%)
                  </div>
                )}
              </div>
            </div>
          ))}
          {sortedByDemand.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No missions requested yet
            </p>
          )}
        </div>
      </Card>

      {/* Biggest Price Drops */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          📉 Biggest Price Drops (Supply & Demand)
        </h3>
        <div className="space-y-3">
          {sortedByDrop
            .filter((stat) => stat.priceChange > 0)
            .slice(0, 5)
            .map((stat, index) => (
              <div
                key={stat.mission.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {stat.mission.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 line-through">
                      {stat.mission.baseReward} 🪙
                    </span>
                    <span className="text-lg font-bold text-green-700">
                      {stat.mission.currentReward} 🪙
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl font-bold text-red-600">
                    -{stat.priceDropPercent.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.mission.requestCount}{" "}
                    {stat.mission.requestCount === 1 ? "request" : "requests"}
                  </div>
                </div>
              </div>
            ))}
          {sortedByDrop.filter((s) => s.priceChange > 0).length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No price drops yet - all missions at base price
            </p>
          )}
        </div>
      </Card>

      {/* All Missions Table */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          📋 All Missions Marketplace
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-3 font-semibold text-gray-700">
                  Mission
                </th>
                <th className="text-center p-3 font-semibold text-gray-700">
                  Base Price
                </th>
                <th className="text-center p-3 font-semibold text-gray-700">
                  Current Price
                </th>
                <th className="text-center p-3 font-semibold text-gray-700">
                  Requests
                </th>
                <th className="text-center p-3 font-semibold text-gray-700">
                  Change
                </th>
                <th className="text-center p-3 font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {missionStats.map((stat) => (
                <tr
                  key={stat.mission.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3">
                    <div className="font-medium text-gray-900">
                      {stat.mission.title}
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-xs">
                      {stat.mission.description}
                    </div>
                  </td>
                  <td className="p-3 text-center text-gray-700">
                    {stat.mission.baseReward} 🪙
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-green-700">
                      {stat.mission.currentReward} 🪙
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        stat.mission.requestCount > 2
                          ? "bg-red-100 text-red-800"
                          : stat.mission.requestCount > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {stat.mission.requestCount}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {stat.priceChange > 0 ? (
                      <div className="text-red-600 font-semibold">
                        ↓ {stat.priceDropPercent.toFixed(0)}%
                      </div>
                    ) : (
                      <div className="text-gray-400">—</div>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        stat.mission.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : stat.mission.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : stat.mission.status === "COMPLETED"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {stat.mission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Educational Note */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300">
        <h3 className="text-lg font-bold mb-2 text-amber-900">
          💡 How Supply & Demand Works
        </h3>
        <p className="text-gray-700">
          When more students request the same mission, its price drops! This
          teaches us about <strong>supply and demand</strong>: when something is
          popular (high demand), but there's only limited availability (limited
          supply), the value changes. In our classroom market, popular missions
          become less valuable as more students want to do them.
        </p>
      </Card>
    </div>
  );
}
