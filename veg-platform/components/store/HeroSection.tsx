'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, Shield, Clock, Sprout } from 'lucide-react';

export default function HeroSection() {
    return (
        <section style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #fef9c3 70%, #f0fdf4 100%)',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
        }}>
            {/* Animated background elements */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(45,106,79,0.08)',
                    animation: 'float 6s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '10%',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'rgba(82,183,136,0.1)',
                    animation: 'float 5s ease-in-out infinite 1s',
                }} />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '30%',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'rgba(252,191,73,0.1)',
                    animation: 'float 7s ease-in-out infinite 2s',
                }} />
                {/* Floating emojis */}
                {['🥕', '🥬', '🍅', '🥦', '🌿', '🧅'].map((emoji, i) => {
                    const sizes = [1.8, 2.1, 1.9, 2.0, 1.7, 1.85];
                    return (
                        <span
                            key={i}
                            style={{
                                position: 'absolute',
                                fontSize: `${sizes[i]}rem`,
                                top: `${10 + i * 15}%`,
                                left: `${5 + i * 16}%`,
                                animation: `float ${4 + i}s ease-in-out infinite ${i * 0.5}s`,
                                opacity: 0.4,
                            }}
                        >
                            {emoji}
                        </span>
                    );
                })}
            </div>

            <div className="container" style={{
                position: 'relative',
                zIndex: 1,
                padding: '60px 20px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px',
                alignItems: 'center',
            }}>
                {/* Left content */}
                <div className="animate-fadeInUp">
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: 'rgba(45,106,79,0.1)',
                        borderRadius: 'var(--radius-full)',
                        marginBottom: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                    }}>
                        <Sprout size={16} />
                        100% Farm Fresh & Organic
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                        fontWeight: 700,
                        lineHeight: 1.15,
                        marginBottom: '20px',
                        color: 'var(--primary-dark)',
                    }}>
                        Farm Fresh
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Vegetables
                        </span>
                        <br />
                        Delivered Daily
                    </h1>

                    <p style={{
                        fontSize: '1.1rem',
                        color: 'var(--text-light)',
                        lineHeight: 1.7,
                        marginBottom: '32px',
                        maxWidth: '480px',
                    }}>
                        Experience the joy of fresh, organic vegetables sourced directly from
                        local farms. Quality you can taste, freshness you can trust.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <Link href="/?category=all" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                            Shop Now <ArrowRight size={18} />
                        </Link>
                        <Link href="/?featured=true" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                            View Specials
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div style={{
                        display: 'flex',
                        gap: '24px',
                        marginTop: '48px',
                        flexWrap: 'wrap',
                    }}>
                        {[
                            { icon: Truck, text: 'Free Delivery', sub: 'Orders ₹500+' },
                            { icon: Shield, text: '100% Fresh', sub: 'Quality Guaranteed' },
                            { icon: Clock, text: 'Same Day', sub: 'Delivery Available' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--shadow-md)',
                                }}>
                                    <item.icon size={18} color="var(--primary)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{item.text}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right - Hero illustration */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                }} className="hero-image">
                    <div style={{
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(45,106,79,0.12), rgba(82,183,136,0.08))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        animation: 'float 6s ease-in-out infinite',
                    }}>
                        <div style={{
                            fontSize: '12rem',
                            lineHeight: 1,
                            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))',
                        }}>
                            🥬
                        </div>
                        {/* Orbiting elements */}
                        {['🥕', '🍅', '🥦', '🧅'].map((emoji, i) => (
                            <span
                                key={i}
                                style={{
                                    position: 'absolute',
                                    fontSize: '2.5rem',
                                    top: `${[5, 50, 85, 45][i]}%`,
                                    left: `${[-5, 95, 30, -10][i]}%`,
                                    animation: `float ${3 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
                                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                                }}
                            >
                                {emoji}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        @media (max-width: 768px) {
          .hero-image {
            display: none !important;
          }
          section > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </section>
    );
}
