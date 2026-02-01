import { Suspense } from "react";
import ServicesClient from "./ServicesClient";

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading services...
        </div>
      }
    >
      <ServicesClient />
    </Suspense>
  );
}
