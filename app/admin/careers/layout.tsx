'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export default function AdminCareersLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) {
          router.replace('/admin/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        router.replace('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      router.push('/admin/login');
    }
  }

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', href: '/admin/careers', icon: LayoutDashboard },
    { label: 'Job Openings', href: '/admin/careers/jobs', icon: Briefcase },
    { label: 'Applications', href: '/admin/careers/applications', icon: Users },
    { label: 'Interviews', href: '/admin/careers/interviews', icon: Calendar },
  ];

  return (
    <div className="admin-layout">
      {/* Top Admin Navbar */}
      <header className="admin-nav-header">
        <div className="admin-nav-container">
          <div className="admin-nav-brand">
            <Link href="/admin/careers" className="admin-nav-logo">
              <span className="admin-nav-mark">
                <Image
                  src="/images/techverse-logo.jpg"
                  alt="Techverse"
                  width={28}
                  height={28}
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
              </span>
              <span className="admin-nav-title">Techverse Recruitment</span>
            </Link>
            <span className="admin-nav-badge">
              <ShieldCheck size={12} />
              Admin
            </span>
          </div>

          <nav className="admin-nav-tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin/careers'
                  ? pathname === '/admin/careers'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-tab ${isActive ? 'is-active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="admin-nav-actions">
            <Link
              href="/admin/careers/jobs/new"
              className="btn btn--primary btn--sm admin-quick-post"
            >
              <Plus size={14} />
              <span>Post Job</span>
            </Link>

            <Link
              href="/careers"
              target="_blank"
              className="admin-nav-link"
              title="View Public Careers Page"
            >
              <span>Careers Site</span>
              <ExternalLink size={13} />
            </Link>

            <div className="admin-user-pill">
              <span className="admin-user-name">{user?.name || user?.email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-logout-btn"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Page Body */}
      <main className="admin-main-content">
        <div className="admin-content-wrap">{children}</div>
      </main>
    </div>
  );
}
