"use client";

import dynamic from "next/dynamic";

const PublicProfileScene = dynamic(
  () => import("@/components/profile/PublicProfileScene"),
  { ssr: false },
);

export default function PublicProfileSceneClient() {
  return <PublicProfileScene />;
}
