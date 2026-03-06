'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Leaf, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useUser();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const result = await register(form.name, form.email, form.phone, form.password);
        if (result.success) {
            router.push('/');
        } else {
            setError(result.error || 'Registration failed');
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
                    position: 'absolute', top: '10%', right: '12%', width: '200px', height: '200px',
                    borderRadius: '50%', background: 'rgba(45,106,79,0.06)',
                    animation: 'float 6s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute', bottom: '20%', left: '8%', width: '160px', height: '160px',
                    borderRadius: '50%', background: 'rgba(82,183,136,0.08)',
                    animation: 'float 5s ease-in-out infinite 1s',
                }} />
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)',
                padding: '44px 40px',
                width: '100%',
                maxWidth: '460px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.5)',
                position: 'relative',
                zIndex: 1,
            }} className="animate-fadeInUp">
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
                        Create Account
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Join VegFresh for fresh vegetable delivery
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* Full Name */}
                        <div>
                            <label style={{
                                display: 'block', fontSize: '0.85rem', fontWeight: 600,
                                marginBottom: '6px', color: 'var(--text)',
                            }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{
                                    position: 'absolute', left: '14px', top: '50%',
                                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                                }} />
                                <input
                                    className="input" name="name" value={form.name}
                                    onChange={handleChange} placeholder="John Doe"
                                    required style={{ paddingLeft: '42px' }}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{
                                display: 'block', fontSize: '0.85rem', fontWeight: 600,
                                marginBottom: '6px', color: 'var(--text)',
                            }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{
                                    position: 'absolute', left: '14px', top: '50%',
                                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                                }} />
                                <input
                                    className="input" type="email" name="email" value={form.email}
                                    onChange={handleChange} placeholder="your@email.com"
                                    required style={{ paddingLeft: '42px' }}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label style={{
                                display: 'block', fontSize: '0.85rem', fontWeight: 600,
                                marginBottom: '6px', color: 'var(--text)',
                            }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{
                                    position: 'absolute', left: '14px', top: '50%',
                                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                                }} />
                                <input
                                    className="input" name="phone" value={form.phone}
                                    onChange={handleChange} placeholder="+91 98765 43210"
                                    required style={{ paddingLeft: '42px' }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{
                                display: 'block', fontSize: '0.85rem', fontWeight: 600,
                                marginBottom: '6px', color: 'var(--text)',
                            }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{
                                    position: 'absolute', left: '14px', top: '50%',
                                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                                }} />
                                <input
                                    className="input" type={showPassword ? 'text' : 'password'}
                                    name="password" value={form.password}
                                    onChange={handleChange} placeholder="Min. 6 characters"
                                    required style={{ paddingLeft: '42px', paddingRight: '42px' }}
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(!showPassword)}
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

                        {/* Confirm Password */}
                        <div>
                            <label style={{
                                display: 'block', fontSize: '0.85rem', fontWeight: 600,
                                marginBottom: '6px', color: 'var(--text)',
                            }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{
                                    position: 'absolute', left: '14px', top: '50%',
                                    transform: 'translateY(-50%)', color: 'var(--text-muted)',
                                }} />
                                <input
                                    className="input" type="password"
                                    name="confirmPassword" value={form.confirmPassword}
                                    onChange={handleChange} placeholder="Confirm your password"
                                    required style={{ paddingLeft: '42px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit" className="btn-primary" disabled={loading}
                        style={{
                            width: '100%', padding: '14px', fontSize: '1rem',
                            justifyContent: 'center', opacity: loading ? 0.7 : 1,
                            marginTop: '24px',
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div style={{
                    textAlign: 'center', marginTop: '24px', fontSize: '0.9rem',
                    color: 'var(--text-light)',
                }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{
                        color: 'var(--primary)', fontWeight: 600, textDecoration: 'none',
                    }}>
                        Sign In
                    </Link>
                </div>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Link href="/" style={{
                        fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none',
                    }}>
                        ← Back to store
                    </Link>
                </div>
            </div>
        </div>
    );
}
