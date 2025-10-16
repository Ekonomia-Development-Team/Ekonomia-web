import Sidebar from "@/components/sidebar/sidebar";
import Button from "@/components/atom/button";
import React from "react";

// Tela inicial do dashboard
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <div>
            <Button>Nova transação</Button>
          </div>
        </div>
        <p>Visão geral das finanças.</p>
      </main>
    </div>
  );
}
