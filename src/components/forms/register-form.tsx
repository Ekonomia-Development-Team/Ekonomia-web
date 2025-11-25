"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/atom/input";
import Button from "@/components/atom/button";
import { useAuth } from "@/context/auth-context";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login({ email: email || "novo@ekonomia.app", password });
    setStatus("success");
    setTimeout(() => router.push("/dashboard"), 900);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center">Cadastrar</h2>
      <Input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Criando..." : "Cadastrar"}</Button>
      {status === "success" && <p style={{ color: "#7ff1cf" }}>Conta mock pronta! Redirecionando...</p>}
      <button type="button" onClick={() => router.back()} className="text-sm text-gray-500 underline">
        Voltar
      </button>
    </form>
  );
}
