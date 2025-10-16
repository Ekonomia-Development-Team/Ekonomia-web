import Input from "@/components/atom/input";
import Button from "@/components/atom/button";
import React from "react";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="flex flex-col gap-3">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button>Login</Button>
      </div>
    </div>
  );
}
