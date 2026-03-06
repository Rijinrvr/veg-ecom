'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, Leaf, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { getItemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const itemCount = getItemCount();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(250, 253, 247, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border)',
        }}>
            {/* Top announcement bar */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
                color: 'white',
                textAlign: 'center',
                padding: '6px 16px',
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
            }}>
                🚛 Free delivery on orders above ₹500 | 🌿 100% Fresh & Organic Vegetables
            </div>

            <nav className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                gap: '20px',
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    flexShrink: 0,
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Leaf size={22} color="white" />
                    </div>
                    <div>
                        <span style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.3rem',
                            fontWeight: 700,
                            color: 'var(--primary-dark)',
                        }}>VegFresh</span>
                        <span style={{
                            display: 'block',
                            fontSize: '0.65rem',
                            color: 'var(--text-muted)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginTop: '-2px',
                        }}>Farm to Table</span>
                    </div>
                </Link>

                {/* Search bar - hidden on mobile */}
                <form onSubmit={handleSearch} style={{
                    flex: 1,
                    maxWidth: '480px',
                    position: 'relative',
                }} className="search-desktop">
                    <input
                        type="text"
                        placeholder="Search fresh vegetables..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 16px 10px 44px',
                            border: '2px solid var(--border)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.9rem',
                            background: 'white',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary-light)';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(82,183,136,0.15)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                    }} />
                </form>

                {/* Right actions */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
                }}>
                    <Link href="/admin/login" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--text-light)',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        border: '1px solid transparent',
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-50)';
                            e.currentTarget.style.color = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-light)';
                        }}>
                        <User size={18} />
                        <span className="hide-mobile">Admin</span>
                    </Link>

                    <Link href="/cart" style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 18px',
                        borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(45,106,79,0.25)',
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(45,106,79,0.35)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(45,106,79,0.25)';
                        }}>
                        <ShoppingCart size={18} />
                        <span className="hide-mobile">Cart</span>
                        {itemCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                background: 'var(--accent)',
                                color: 'white',
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                border: '2px solid white',
                                animation: 'bounceIn 0.3s ease-out',
                            }}>
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="mobile-menu-btn"
                        style={{
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text)',
                        }}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile search */}
            {isMenuOpen && (
                <div style={{
                    padding: '0 20px 16px',
                    animation: 'fadeInUp 0.3s ease-out',
                }}>
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search vegetables..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input"
                            style={{ borderRadius: 'var(--radius-full)' }}
                        />
                    </form>
                </div>
            )}

            <style jsx>{`
        @media (max-width: 768px) {
          .search-desktop {
            display: none !important;
          }
          .hide-mobile {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
        </header>
    );
}
