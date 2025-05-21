"use client";

import { Suspense } from "react";

import Movies from "../components/sections/Movies";

export const dynamic = "force-dynamic";

export default function MoviesPage() {
  return (
    <Suspense fallback={<div>Loading Movies...</div>}>
      <Movies />
    </Suspense>
  );
}
