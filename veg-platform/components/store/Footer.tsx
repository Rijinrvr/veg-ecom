'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{
            background: 'linear-gradient(180deg, var(--bg-dark) 0%, #0a1810 100%)',
            color: 'white',
            marginTop: '80px',
        }}>
            {/* Newsletter section */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                padding: '48px 20px',
                textAlign: 'center',
            }}>
                <div className="container">
                    <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        marginBottom: '8px',
                        color: 'white',
                    }}>Get Fresh Deals in Your Inbox</h3>
                    <p style={{ opacity: 0.9, marginBottom: '24px', fontSize: '0.95rem' }}>
                        Subscribe for exclusive offers, seasonal recipes, and farm updates
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        maxWidth: '480px',
                        margin: '0 auto',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}>
                        <input
                            suppressHydrationWarning
                            type="email"
                            placeholder="Enter your email"
                            style={{
                                flex: 1,
                                minWidth: '240px',
                                padding: '14px 20px',
                                borderRadius: 'var(--radius-full)',
                                border: 'none',
                                fontSize: '0.95rem',
                                outline: 'none',
                            }}
                        />
                        <button suppressHydrationWarning className="btn-accent" style={{ whiteSpace: 'nowrap' }}>Subscribe</button>
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="container" style={{ padding: '60px 20px 30px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '40px',
                    marginBottom: '40px',
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary-light), var(--primary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Leaf size={24} color="white" />
                            </div>
                            <span style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.5rem',
                                fontWeight: 700,
                            }}>VegFresh</span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                            Delivering farm-fresh vegetables straight to your doorstep.
                            Quality you can taste, freshness you can trust.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', color: 'var(--primary-light)' }}>
                            Quick Links
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Home', 'Products', 'Cart', 'Orders'].map(link => (
                                <Link
                                    key={link}
                                    href={link === 'Home' ? '/' : link === 'Products' ? '/?category=all' : `/${link.toLowerCase()}`}
                                    style={{
                                        color: 'rgba(255,255,255,0.6)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-light)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                                >
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', color: 'var(--primary-light)' }}>
                            Categories
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Leafy Greens', 'Root Vegetables', 'Herbs & Seasonings', 'Exotic Vegetables'].map(cat => (
                                <Link
                                    key={cat}
                                    href={`/?category=${encodeURIComponent(cat)}`}
                                    style={{
                                        color: 'rgba(255,255,255,0.6)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-light)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px', color: 'var(--primary-light)' }}>
                            Contact Us
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                <Phone size={16} />
                                <span>+91 98765 43210</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                <Mail size={16} />
                                <span>hello@vegfresh.in</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                <MapPin size={16} />
                                <span>Fresh Market, Kerala, India</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'rgba(255,255,255,0.6)',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--primary-light)';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                                        }}
                                    >
                                        <Icon size={16} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '24px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.85rem',
                }}>
                    <p>© 2026 VegFresh. All rights reserved. Made with 💚 for healthy living.</p>
                </div>
            </div>
        </footer>
    );
}
