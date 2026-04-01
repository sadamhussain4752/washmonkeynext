"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import VehiclespageContent from "./vehiclespage";

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <VehiclespageContent />
    </Suspense>
  );
}