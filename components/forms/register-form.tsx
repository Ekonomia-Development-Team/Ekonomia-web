"use client";

import { useState } from "react";

interface Props {
  onBack: () => void;
}

export default function RegisterForm({ onBack }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Cadastro:", { name, email, password });
    // depois chamamos auth.service.register(name, email, password)
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center">Cadastrar</h2>
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg p-2"
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded-lg p-2"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded-lg p-2"
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Cadastrar
      </button>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-gray-500 underline"
      >
        Voltar
      </button>
    </form>
  );
}
