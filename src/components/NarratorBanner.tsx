"use client";

import { useState, useEffect } from "react";
import { NarratorPage } from "@/types";

interface NarratorBannerProps {
  studentName: string;
  page: NarratorPage;
  spendTokens?: number;
  growTokens?: number;
  missionCount?: number;
  availableMissions?: number;
  recentAction?: string;
  refreshKey?: number; // Change this to trigger a new fetch
}

export function NarratorBanner({
  studentName,
  page,
  spendTokens,
  growTokens,
  missionCount,
  availableMissions,
  recentAction,
  refreshKey = 0,
}: NarratorBannerProps) {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchNarratorMessage() {
      setIsLoading(true);
      
      try {
        const response = await fetch("/api/gemini/explain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "NARRATOR",
            studentName,
            context: {
              page,
              spendTokens,
              growTokens,
              missionCount,
              availableMissions,
              recentAction,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();
        
        if (isMounted) {
          setMessage(data.explanation || getFallbackMessage(page));
        }
      } catch (error) {
        if (isMounted) {
          setMessage(getFallbackMessage(page));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchNarratorMessage();

    return () => {
      isMounted = false;
    };
  }, [studentName, page, refreshKey, spendTokens, growTokens, missionCount, availableMissions, recentAction]);

  return (
    <div className="bg-linear-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-2xl p-5 mb-6 shadow-lg border border-white/20">
      <div className="flex items-center gap-4">
        <div className="text-3xl shrink-0">
          🎙️
        </div>
        <div className="grow min-w-0">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-5 bg-white/25 rounded-lg w-3/4 max-w-xs"></div>
            </div>
          ) : (
            <p className="text-white text-base font-medium leading-snug">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getFallbackMessage(page: NarratorPage): string {
  const fallbacks: Record<NarratorPage, string> = {
    dashboard: "Welcome back! Check out the marketplace for new missions to earn tokens.",
    marketplace: "Request missions to earn tokens. Remember, popular missions pay less!",
    missions: "Complete your missions and ask your teacher to approve them.",
    grow: "Your Grow tokens are earning 2% every week. Patience pays off!",
    shop: "Spend your tokens wisely. Save some for later too!",
  };
  
  return fallbacks[page];
}
