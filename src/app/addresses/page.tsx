"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import AddressesContent from "./addresspage";

export default function AddressesPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AddressesContent />
    </Suspense>
  );
}