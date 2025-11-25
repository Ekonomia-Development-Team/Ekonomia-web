"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/atom/input';
import Button from '@/components/atom/button';
import { useAuth } from '@/context/auth-context';

export default function LoginForm() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? 'john@company.com');
  const [password, setPassword] = useState('mock-password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    await login({ email, password });
    setStatus('success');
    setTimeout(() => router.push('/dashboard'), 800);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 style={{ margin: 0 }}>Acesse sua conta mock</h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.35rem' }}>
          Use qualquer senha, salvamos apenas no navegador.
        </p>
      </div>
      <Input type="email" placeholder="E-mail" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <Input type="password" placeholder="Senha" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Autenticando…' : 'Entrar agora'}
      </Button>
      {status === 'success' && <p style={{ color: '#7ff1cf' }}>Login mock efetuado! Redirecionando…</p>}
    </form>
  );
}
