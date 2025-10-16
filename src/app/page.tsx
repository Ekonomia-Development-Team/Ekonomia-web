import Link from "next/link";
import Button from "@/components/atom/button";

export default function Home() {
  return (
    <div className="flex min-h-screen">
     
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-bold">Bem-vindo ao Ekonomia!</h1>
        <div className="flex flex-wrap gap-4">
          <Link href="/">
            <Button>Home</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
          <Link href="/dashboard/expenses">
            <Button variant="secondary">Gastos</Button>
          </Link>
          <Link href="/dashboard/income">
            <Button variant="secondary">Receitas</Button>
          </Link>
          <Link href="/dashboard/reports">
            <Button variant="secondary">Relatórios</Button>
          </Link>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Registrar</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
