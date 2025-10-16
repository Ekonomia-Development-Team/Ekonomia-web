import Sidebar from "@/components/sidebar/sidebar";
import Button from "@/components/atom/button";
import React from "react";

// Página de relatórios
export default function ReportsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <Button>Gerar relatório</Button>
        </div>
        <p>Aqui você verá relatórios e gráficos.</p>
      </main>
    </div>
  );
}
