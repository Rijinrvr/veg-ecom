'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    LogOut,
    Leaf,
    ChevronRight,
    ExternalLink,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, username, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isAuthenticated, pathname, router]);

    // Don't show admin layout on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return null;
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'linear-gradient(180deg, var(--primary-dark) 0%, #0a1810 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 50,
                overflow: 'hidden',
            }} className="admin-sidebar">
                {/* Logo */}
                <div style={{
                    padding: '24px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, var(--primary-light), var(--primary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Leaf size={22} color="white" />
                        </div>
                        <div>
                            <div style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.15rem',
                                fontWeight: 700,
                            }}>
                                VegFresh
                            </div>
                            <div style={{
                                fontSize: '0.65rem',
                                opacity: 0.6,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}>
                                Admin Panel
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {navItems.map(item => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        borderRadius: 'var(--radius-md)',
                                        color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: isActive ? 600 : 400,
                                        background: isActive ? 'rgba(82,183,136,0.2)' : 'transparent',
                                        transition: 'all 0.2s ease',
                                        border: isActive ? '1px solid rgba(82,183,136,0.3)' : '1px solid transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                                        }
                                    }}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                    {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Visit store link */}
                <div style={{ padding: '12px' }}>
                    <Link href="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        color: 'rgba(255,255,255,0.5)',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                        }}>
                        <ExternalLink size={16} /> Visit Store
                    </Link>
                </div>

                {/* User section */}
                <div style={{
                    padding: '16px 20px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{username}</div>
                        <div style={{ fontSize: '0.72rem', opacity: 0.5 }}>Administrator</div>
                    </div>
                    <button
                        onClick={() => { logout(); router.push('/admin/login'); }}
                        style={{
                            padding: '8px',
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            color: 'rgba(255,255,255,0.6)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(220,38,38,0.2)';
                            e.currentTarget.style.color = '#fca5a5';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                        }}
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '32px',
                minHeight: '100vh',
            }} className="admin-main">
                {children}
            </main>

            <style jsx>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 70px !important;
          }
          .admin-sidebar span,
          .admin-sidebar div > div:last-child {
            display: none;
          }
          .admin-main {
            margin-left: 70px !important;
            padding: 16px !important;
          }
        }
      `}</style>
        </div>
    );
}
