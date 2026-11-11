'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin/careers');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-head">
          <div className="admin-login-brand">
            <span className="admin-login-logo">
              <Image
                src="/images/techverse-logo.jpg"
                alt="Techverse"
                width={36}
                height={36}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            </span>
            <div>
              <h2>Techverse Infotech</h2>
              <span className="admin-login-badge">
                <ShieldCheck size={12} />
                Recruitment Administration
              </span>
            </div>
          </div>
          <p className="admin-login-subtitle">
            Sign in with authorized administrator credentials to manage job openings, candidate dossiers, and interview pipelines.
          </p>
        </div>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="admin-email">Admin Email Address</label>
            <div className="admin-input-wrap">
              <Mail size={16} className="admin-input-icon" />
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techverseinfotech.com"
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Secure Password</label>
            <div className="admin-input-wrap">
              <Lock size={16} className="admin-input-icon" />
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="admin-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn--primary admin-login-submit"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="admin-login-footer">
          <span>Protected by AES-256 JWT sessions &amp; bcrypt password hashing.</span>
          <Link href="/" className="admin-login-back">
            Return to Public Website →
          </Link>
        </div>
      </div>
    </div>
  );
}
