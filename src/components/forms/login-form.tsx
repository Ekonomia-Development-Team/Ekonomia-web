"use client";

import { useState } from "react";
import Input from "@/components/atom/input";
import Button from "@/components/atom/button";

interface Props {
  onBack: () => void;
}

export default function LoginForm({ onBack }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    // depois chamamos auth.service.login(email, password)
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center">Entrar</h2>
      <Input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Entrar</Button>
      <button type="button" onClick={onBack} className="text-sm text-gray-500 underline">
        Voltar
      </button>
    </form>
  );
}
