import Sidebar from "@/components/sidebar/sidebar";
import Button from "@/components/atom/button";
import React from "react";

// Página de gastos
export default function ExpensesPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gastos</h1>
          <Button>Adicionar gasto</Button>
        </div>
        <p>Aqui você verá a lista de gastos.</p>
      </main>
    </div>
  );
}
