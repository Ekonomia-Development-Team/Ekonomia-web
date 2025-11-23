import Sidebar from "@/components/sidebar/sidebar";
import CustomizableDashboard from "@/components/dashboard/customizable-dashboard";
import React from "react";

// Tela inicial do dashboard com sistema personalizável
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <CustomizableDashboard />
      </main>
    </div>
  );
}
