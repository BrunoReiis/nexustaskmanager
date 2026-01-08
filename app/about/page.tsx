'use client';

import { title } from "@/components/primitives";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AboutPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className={title()}>About</h1>
      </div>
    </ProtectedRoute>
  );
}
