"use client";

import React, { useEffect } from "react";
import LineupBuilder from "@/features/lineup/components/LineupBuilder";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useLineupStore } from "@/features/lineup/stores/useLineupStore";

export default function TeamLineupPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = React.use(params);
  const { setSelectedTeamId } = useLineupStore();

  useEffect(() => {
    if (teamId) {
      setSelectedTeamId(teamId);
    }
  }, [teamId, setSelectedTeamId]);

  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <LineupBuilder />
        </div>
      </div>
    </div>
  );
}
