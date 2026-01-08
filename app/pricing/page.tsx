'use client';

import { title } from "@/components/primitives";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PricingPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className={title()}>Pricing</h1>
      </div>
    </ProtectedRoute>
  );
}
