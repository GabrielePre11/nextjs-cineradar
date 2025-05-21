"use client";
import { Suspense } from "react";

import TVSeries from "../components/sections/TVSeries";

export const dynamic = "force-dynamic";

export default function TVSeriesPage() {
  return (
    <Suspense fallback={<div>Loading TVSeries...</div>}>
      <TVSeries />
    </Suspense>
  );
}
