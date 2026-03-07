'use client';

import React, { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectIsLoggedIn } from '@/store/slices/userSlice';
import { Gift, Calendar, CheckCircle, Lock, Info, Sparkles, Award } from 'lucide-react';
import { Coupon } from '@/types';
import Link from 'next/link';

const ScratchCard = ({ coupon, onReveal }: { coupon: Coupon, onReveal: () => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scratched, setScratched] = useState(coupon.isScratched);
    const [isRevealed, setIsRevealed] = useState(coupon.isScratched);

    useEffect(() => {
        if (scratched) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fill background
        ctx.fillStyle = '#d1d5db'; // gray-300
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add some "scratch here" text or pattern
        ctx.fillStyle = '#9ca3af'; // gray-400
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);

        let isDrawing = false;

        const scratch = (x: number, y: number) => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            // Check how much is scratched
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let count = 0;
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) count++;
            }
            const percent = (count / (pixels.length / 4)) * 100;
            if (percent > 40 && !scratched) {
                setScratched(true);
                setTimeout(() => {
                    setIsRevealed(true);
                    onReveal();
                }, 300);
            }
        };

        const handleMouseDown = (e: MouseEvent) => { isDrawing = true; scratch(e.offsetX, e.offsetY); };
        const handleMouseMove = (e: MouseEvent) => { if (isDrawing) scratch(e.offsetX, e.offsetY); };
        const handleMouseUp = () => { isDrawing = false; };

        const handleTouchStart = (e: TouchEvent) => {
            isDrawing = true;
            const b = canvas.getBoundingClientRect();
            scratch(e.touches[0].clientX - b.left, e.touches[0].clientY - b.top);
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (isDrawing) {
                const b = canvas.getBoundingClientRect();
                scratch(e.touches[0].clientX - b.left, e.touches[0].clientY - b.top);
            }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [scratched, onReveal]);

    return (
        <div style={{
            position: 'relative', width: '220px', height: '220px',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            border: '2px solid var(--border)', background: 'white',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
        }}>
            {/* The Revealed Content */}
            <div style={{
                textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '8px', zIndex: 1,
            }}>
                <Award size={48} color="var(--accent)" />
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)' }}>₹{coupon.value}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Discount Reveal!</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, background: '#fef3c7', padding: '4px 8px', borderRadius: '4px', border: '1px dashed #f59e0b' }}>{coupon.code}</div>
            </div>

            {/* The Scratch Layer */}
            {!isRevealed && (
                <canvas
                    ref={canvasRef}
                    width={220}
                    height={220}
                    style={{
                        position: 'absolute', top: 0, left: 0, cursor: 'crosshair', zIndex: 2,
                        touchAction: 'none',
                    }}
                />
            )}
            
            {coupon.isUsed && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)',
                    zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: '8px', color: 'var(--text-muted)',
                }}>
                    <CheckCircle size={32} />
                    <span style={{ fontWeight: 700 }}>REDEEMED</span>
                </div>
            )}
        </div>
    );
};

export default function RewardsPage() {
    const user = useAppSelector(selectUser);
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCoupons = async () => {
        if (!user) return;
        try {
            const res = await fetch(`/api/users/${user.id}/coupons`);
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (error) {
            console.error('Failed to fetch coupons', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn && user) {
            fetchCoupons();
        } else if (!isLoggedIn) {
            setLoading(false);
        }
    }, [isLoggedIn, user]);

    const handleScratch = async (id: string) => {
        try {
            await fetch(`/api/coupons/${id}/scratch`, { method: 'POST' });
            // Update local state is done automatically by component reveal, but we can refresh
        } catch (error) {
            console.error('Failed to update scratch status', error);
        }
    };

    if (!isLoggedIn) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div className="container" style={{ padding: '80px 20px', textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🎁</div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '16px' }}>My Rewards</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                        Sign in to view your earned rewards, scratch coupons, and save money on your next vegetable haul!
                    </p>
                    <Link href="/login" className="btn-primary" style={{ padding: '14px 40px' }}>Sign In to View Rewards</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="container" style={{ padding: '40px 20px', flex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <Sparkles color="var(--accent)" /> My Rewards & Coupons
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Earn scratch cards with every purchase over ₹100!
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '220px', borderRadius: 'var(--radius-lg)' }} />)}
                    </div>
                ) : coupons.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'var(--primary-50)', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border)' }}>
                        <Gift size={64} color="var(--text-muted)" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>No rewards yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Complete your first purchase to earn a scratch card!</p>
                        <Link href="/" className="btn-primary">Shop Now</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '32px', justifyContent: 'center' }}>
                        {coupons.sort((a, b) => b.isScratched ? 1 : -1).map((coupon) => (
                            <div key={coupon.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                                <ScratchCard coupon={coupon} onReveal={() => handleScratch(coupon.id)} />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={14} /> Exp: {new Date(coupon.expiryDate).toLocaleDateString()}
                                    </div>
                                    {!coupon.isScratched && (
                                        <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', marginTop: '4px', animation: 'pulse 2s infinite' }}>SCRATCH TO REVEAL!</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: '80px', padding: '32px', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Info size={20} color="var(--primary)" /> How it works
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                        {[
                            { title: 'Shop & Earn', desc: 'Every order you place earns you a mystery scratch card.' },
                            { title: 'Scratch & Win', desc: 'Scratch the card here to reveal your discount points (₹5 - ₹50).' },
                            { title: 'Redeem', desc: 'Apply your revealed coupons during checkout to save instantly!' },
                        ].map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, flexShrink: 0,
                                }}>{i + 1}</div>
                                <div>
                                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>{step.title}</div>
                                    <div style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.5 }}>{step.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
