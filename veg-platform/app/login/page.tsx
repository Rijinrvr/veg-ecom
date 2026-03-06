'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { loginUser, selectUserLoading, selectUserError, clearUserError, selectRedirectAfterLogin, clearRedirectAfterLogin } from '@/store/slices/userSlice';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import * as yup from 'yup';

const loginSchema = yup.object({
    email: yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    password: yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectUserLoading);
    const serverError = useAppSelector(selectUserError);
    const redirectAfterLogin = useAppSelector(selectRedirectAfterLogin);
    const router = useRouter();

    const validateField = async (field: string, value: string) => {
        try {
            await loginSchema.validateAt(field, { email, password, [field]: value });
            setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
        } catch (err: unknown) {
            if (err instanceof yup.ValidationError) {
                setFieldErrors(prev => ({ ...prev, [field]: err.message }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearUserError());
        setFieldErrors({});

        try {
            await loginSchema.validate({ email, password }, { abortEarly: false });
        } catch (err: unknown) {
            if (err instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                err.inner.forEach(e => { if (e.path) errors[e.path] = e.message; });
                setFieldErrors(errors);
                return;
            }
        }

        const result = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(result)) {
            const redirectTo = redirectAfterLogin || '/';
            dispatch(clearRedirectAfterLogin());
            router.push(redirectTo);
        }
    };

    const inputErrorStyle = (field: string) => fieldErrors[field]
        ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.1)' }
        : {};

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #fef9c3 100%)',
            padding: '20px',
        }}>
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
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)', padding: '48px 40px',
                width: '100%', maxWidth: '440px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.5)', position: 'relative', zIndex: 1,
            }} className="animate-fadeInUp">
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '16px', boxShadow: '0 8px 24px rgba(45,106,79,0.3)',
                        }}><Leaf size={28} color="white" /></div>
                    </Link>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '4px' }}>
                        Welcome Back!
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {redirectAfterLogin ? 'Sign in to continue with checkout' : 'Sign in to order fresh vegetables'}
                    </p>
                </div>

                {redirectAfterLogin && (
                    <div style={{
                        padding: '12px 16px', background: '#fef3c7', color: '#92400e',
                        borderRadius: 'var(--radius-md)', fontSize: '0.85rem',
                        marginBottom: '20px', fontWeight: 500, textAlign: 'center',
                    }}>
                        🔒 Please sign in to complete your purchase
                    </div>
                )}

                {serverError && (
                    <div style={{
                        padding: '12px 16px', background: '#fee2e2', color: '#991b1b',
                        borderRadius: 'var(--radius-md)', fontSize: '0.85rem',
                        marginBottom: '20px', fontWeight: 500,
                    }}>
                        ❌ {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.email ? '#ef4444' : 'var(--text-muted)' }} />
                            <input className="input" type="email" value={email}
                                onChange={(e) => { setEmail(e.target.value); validateField('email', e.target.value); }}
                                placeholder="your@email.com" style={{ paddingLeft: '42px', ...inputErrorStyle('email') }} />
                        </div>
                        {fieldErrors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '6px', fontWeight: 500 }}>⚠ {fieldErrors.email}</p>}
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.password ? '#ef4444' : 'var(--text-muted)' }} />
                            <input className="input" type={showPassword ? 'text' : 'password'}
                                value={password} onChange={(e) => { setPassword(e.target.value); validateField('password', e.target.value); }}
                                placeholder="Enter your password"
                                style={{ paddingLeft: '42px', paddingRight: '42px', ...inputErrorStyle('password') }} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                position: 'absolute', right: '14px', top: '50%',
                                transform: 'translateY(-50%)', background: 'none',
                                border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                            }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {fieldErrors.password && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '6px', fontWeight: 500 }}>⚠ {fieldErrors.password}</p>}
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{
                        width: '100%', padding: '14px', fontSize: '1rem',
                        justifyContent: 'center', opacity: loading ? 0.7 : 1,
                    }}>
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Create Account
                    </Link>
                </div>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Link href="/" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                        ← Back to store
                    </Link>
                </div>
            </div>
        </div>
    );
}
