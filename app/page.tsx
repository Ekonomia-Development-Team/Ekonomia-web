"use client";

import { useState } from "react";
import LoginForm from "../components/forms/login-form";
import RegisterForm from "../components/forms/register-form";

export default function Home() {
  const [screen, setScreen] = useState<"options" | "login" | "register">("options");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {screen === "options" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Bem-vindo ao Ekonomia</h1>
            <div className="flex flex-col gap-4">
              <button
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => setScreen("login")}
              >
                Entrar
              </button>
              <button
                className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                onClick={() => setScreen("register")}
              >
                Cadastrar
              </button>
            </div>
          </>
        )}
        {screen === "login" && <LoginForm onBack={() => setScreen("options")} />}
        {screen === "register" && <RegisterForm onBack={() => setScreen("options")} />}
      </div>
    </div>
  );
}
