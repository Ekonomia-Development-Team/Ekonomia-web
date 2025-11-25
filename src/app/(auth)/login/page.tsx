import Link from 'next/link';
import LoginForm from '@/components/forms/login-form';

export default function LoginPage() {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <LoginForm />
        <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>
          Precisa de um acesso? <Link href="/register">Crie uma conta mock</Link>
        </p>
      </div>
    </div>
  );
}
