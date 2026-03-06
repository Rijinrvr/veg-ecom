'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { registerUser, selectUserLoading, selectUserError, clearUserError, selectRedirectAfterLogin, clearRedirectAfterLogin } from '@/store/slices/userSlice';
import { Leaf, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from 'lucide-react';
import * as yup from 'yup';

const registerSchema = yup.object({
    name: yup.string()
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    phone: yup.string()
        .required('Phone number is required')
        .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
    password: yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: yup.string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectUserLoading);
    const serverError = useAppSelector(selectUserError);
    const redirectAfterLogin = useAppSelector(selectRedirectAfterLogin);
    const router = useRouter();

    const validateField = async (field: string, value: string) => {
        try {
            await registerSchema.validateAt(field, { ...form, [field]: value });
            setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
        } catch (err: unknown) {
            if (err instanceof yup.ValidationError) {
                setFieldErrors(prev => ({ ...prev, [field]: err.message }));
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Phone: only allow digits, max 10
        if (name === 'phone') {
            const digits = value.replace(/\D/g, '').slice(0, 10);
            setForm(prev => ({ ...prev, phone: digits }));
            validateField('phone', digits);
            return;
        }
        setForm(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearUserError());
        setFieldErrors({});

        try {
            await registerSchema.validate(form, { abortEarly: false });
        } catch (err: unknown) {
            if (err instanceof yup.ValidationError) {
                const errors: Record<string, string> = {};
                err.inner.forEach(e => { if (e.path) errors[e.path] = e.message; });
                setFieldErrors(errors);
                return;
            }
        }

        const result = await dispatch(registerUser({
            name: form.name, email: form.email, phone: form.phone, password: form.password,
        }));
        if (registerUser.fulfilled.match(result)) {
            const redirectTo = redirectAfterLogin || '/';
            dispatch(clearRedirectAfterLogin());
            router.push(redirectTo);
        }
    };

    const inputErrorStyle = (field: string) => fieldErrors[field]
        ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.1)' }
        : {};

    const FieldError = ({ field }: { field: string }) =>
        fieldErrors[field] ? <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '6px', fontWeight: 500 }}>⚠ {fieldErrors[field]}</p> : null;

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #fef9c3 100%)',
            padding: '20px',
        }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '10%', right: '12%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(45,106,79,0.06)', animation: 'float 6s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '20%', left: '8%', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(82,183,136,0.08)', animation: 'float 5s ease-in-out infinite 1s' }} />
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-xl)', padding: '44px 40px',
                width: '100%', maxWidth: '460px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.5)', position: 'relative', zIndex: 1,
            }} className="animate-fadeInUp">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '16px', boxShadow: '0 8px 24px rgba(45,106,79,0.3)',
                        }}><Leaf size={28} color="white" /></div>
                    </Link>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '4px' }}>
                        Create Account
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Join VegFresh for fresh vegetable delivery
                    </p>
                </div>

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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.name ? '#ef4444' : 'var(--text-muted)' }} />
                                <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" style={{ paddingLeft: '42px', ...inputErrorStyle('name') }} />
                            </div>
                            <FieldError field="name" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.email ? '#ef4444' : 'var(--text-muted)' }} />
                                <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={{ paddingLeft: '42px', ...inputErrorStyle('email') }} />
                            </div>
                            <FieldError field="email" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.phone ? '#ef4444' : 'var(--text-muted)' }} />
                                <input className="input" name="phone" value={form.phone} onChange={handleChange}
                                    placeholder="9876543210" inputMode="numeric" maxLength={10}
                                    style={{ paddingLeft: '42px', ...inputErrorStyle('phone') }} />
                            </div>
                            <FieldError field="phone" />
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>10-digit Indian mobile number</p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.password ? '#ef4444' : 'var(--text-muted)' }} />
                                <input className="input" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" style={{ paddingLeft: '42px', paddingRight: '42px', ...inputErrorStyle('password') }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <FieldError field="password" />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: fieldErrors.confirmPassword ? '#ef4444' : 'var(--text-muted)' }} />
                                <input className="input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password" style={{ paddingLeft: '42px', ...inputErrorStyle('confirmPassword') }} />
                            </div>
                            <FieldError field="confirmPassword" />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{
                        width: '100%', padding: '14px', fontSize: '1rem',
                        justifyContent: 'center', opacity: loading ? 0.7 : 1, marginTop: '24px',
                    }}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                </div>
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Link href="/" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to store</Link>
                </div>
            </div>
        </div>
    );
}
