'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useUser();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (result.success) {
            router.push('/');
        } else {
            setError(result.error || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #fef9c3 100%)',
            padding: '20px',
        }}>
            {/* Background decorations */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: '15%', left: '8%', width: '180px', height: '180px',
                    borderRadius: '50%', background: 'rgba(45,106,79,0.06)',
                    animation: 'float 6s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute', bottom: '15%', right: '10%', width: '220px', height: '220px',
                    borderRadius: '50%', background: 'rgba(82,183,136,0.08)',
                    animation: 'float 5s ease-in-out infinite 1s',
                }} />
                <div style={{
                    position: 'absolute', top: '60%', left: '70%', width: '100px', height: '100px',
                    borderRadius: '50%', background: 'rgba(247,127,0,0.06)',
                    animation: 'float 7s ease-in-out infinite 2s',
                }} />
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)',
                padding: '48px 40px',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.5)',
                position: 'relative',
                zIndex: 1,
            }} className="animate-fadeInUp">
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '16px',
                            boxShadow: '0 8px 24px rgba(45,106,79,0.3)',
                        }}>
                            <Leaf size={28} color="white" />
                        </div>
                    </Link>
                    <h1 style={{
                        fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary-dark)',
                        marginBottom: '4px',
                    }}>
                        Welcome Back!
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Sign in to order fresh vegetables
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px 16px', background: '#fee2e2', color: '#991b1b',
                        borderRadius: 'var(--radius-md)', fontSize: '0.85rem',
                        marginBottom: '20px', fontWeight: 500,
                    }}>
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block', fontSize: '0.85rem', fontWeight: 600,
                            marginBottom: '8px', color: 'var(--text)',
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{
                                position: 'absolute', left: '14px', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-muted)',
                            }} />
                            <input
                                className="input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                style={{ paddingLeft: '42px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                        <label style={{
                            display: 'block', fontSize: '0.85rem', fontWeight: 600,
                            marginBottom: '8px', color: 'var(--text)',
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute', left: '14px', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--text-muted)',
                            }} />
                            <input
                                className="input"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '14px', top: '50%',
                                    transform: 'translateY(-50%)', background: 'none',
                                    border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '14px', fontSize: '1rem',
                            justifyContent: 'center', opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div style={{
                    textAlign: 'center', marginTop: '28px', fontSize: '0.9rem',
                    color: 'var(--text-light)',
                }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/register" style={{
                        color: 'var(--primary)', fontWeight: 600, textDecoration: 'none',
                    }}>
                        Create Account
                    </Link>
                </div>

                <div style={{
                    textAlign: 'center', marginTop: '16px',
                }}>
                    <Link href="/" style={{
                        fontSize: '0.82rem', color: 'var(--text-muted)',
                        textDecoration: 'none',
                    }}>
                        ← Back to store
                    </Link>
                </div>
            </div>
        </div>
    );
}
