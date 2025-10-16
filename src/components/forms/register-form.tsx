"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/atom/input";
import Button from "@/components/atom/button";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cadastro:", { name, email, password });
    // depois chamamos auth.service.register(name, email, password)
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center">Cadastrar</h2>
      <Input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
      <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit">Cadastrar</Button>
      <button type="button" onClick={() => router.back()} className="text-sm text-gray-500 underline">
        Voltar
      </button>
    </form>
  );
}
