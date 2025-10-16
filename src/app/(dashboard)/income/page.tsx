import Sidebar from "@/components/sidebar/sidebar";
import Button from "@/components/atom/button";
import React from "react";

// Página de lucros
export default function IncomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Receitas</h1>
          <Button>Adicionar receita</Button>
        </div>
        <p>Aqui você verá a lista de receitas.</p>
      </main>
    </div>
  );
}
