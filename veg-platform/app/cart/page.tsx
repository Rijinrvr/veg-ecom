'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Truck } from 'lucide-react';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, getSubtotal, getDeliveryFee, getTotal, getItemCount } = useCart();

    if (items.length === 0) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'var(--primary-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px',
                    }}>
                        <ShoppingBag size={48} color="var(--primary-light)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '10px' }}>
                        Your Cart is Empty
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px' }}>
                        Looks like you haven&apos;t added any fresh vegetables yet.
                        Start shopping and fill your basket with goodness!
                    </p>
                    <Link href="/" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                        <ArrowLeft size={18} /> Start Shopping
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="container" style={{ padding: '40px 20px', flex: 1 }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <Link href="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        marginBottom: '12px',
                    }}>
                        <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: 'var(--primary-dark)',
                    }}>
                        Shopping Cart
                        <span style={{
                            fontSize: '1rem',
                            fontWeight: 400,
                            color: 'var(--text-muted)',
                            marginLeft: '12px',
                        }}>
                            ({getItemCount()} items)
                        </span>
                    </h1>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 380px',
                    gap: '36px',
                    alignItems: 'start',
                }} className="cart-grid">
                    {/* Cart items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {items.map((item, index) => (
                            <div
                                key={item.product.id}
                                className="card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    padding: '20px',
                                    opacity: 0,
                                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`,
                                }}
                            >
                                {/* Image */}
                                <Link href={`/products/${item.product.id}`}>
                                    <div style={{
                                        width: '90px',
                                        height: '90px',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            width={60}
                                            height={60}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                </Link>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Link href={`/products/${item.product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h3 style={{
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            fontFamily: "'Inter', sans-serif",
                                            marginBottom: '4px',
                                        }}>
                                            {item.product.name}
                                        </h3>
                                    </Link>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                        ₹{item.product.price} per {item.product.unit}
                                    </p>
                                </div>

                                {/* Quantity */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '2px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    overflow: 'hidden',
                                }}>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        style={{
                                            padding: '8px 10px',
                                            background: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span style={{
                                        padding: '8px 14px',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        borderLeft: '2px solid var(--border)',
                                        borderRight: '2px solid var(--border)',
                                    }}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        style={{
                                            padding: '8px 10px',
                                            background: 'white',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                {/* Price */}
                                <span style={{
                                    fontWeight: 700,
                                    fontSize: '1.05rem',
                                    color: 'var(--primary)',
                                    minWidth: '70px',
                                    textAlign: 'right',
                                }}>
                                    ₹{item.product.price * item.quantity}
                                </span>

                                {/* Remove */}
                                <button
                                    onClick={() => removeFromCart(item.product.id)}
                                    style={{
                                        padding: '8px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                        transition: 'color 0.2s',
                                        borderRadius: '50%',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                    title="Remove item"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div style={{
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                        padding: '28px',
                        position: 'sticky',
                        top: '100px',
                    }}>
                        <h3 style={{
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: '24px',
                            color: 'var(--primary-dark)',
                        }}>
                            Order Summary
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-light)' }}>Subtotal ({getItemCount()} items)</span>
                                <span style={{ fontWeight: 600 }}>₹{getSubtotal()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-light)' }}>Delivery Fee</span>
                                <span style={{ fontWeight: 600, color: getDeliveryFee() === 0 ? 'var(--success)' : 'inherit' }}>
                                    {getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee()}`}
                                </span>
                            </div>
                            {getDeliveryFee() > 0 && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 12px',
                                    background: '#fef3c7',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.78rem',
                                    color: '#92400e',
                                }}>
                                    <Truck size={14} />
                                    Add ₹{500 - getSubtotal()} more for free delivery
                                </div>
                            )}
                        </div>

                        <div style={{
                            borderTop: '2px solid var(--border)',
                            paddingTop: '16px',
                            marginBottom: '24px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                                <span style={{ fontWeight: 700, color: 'var(--text)' }}>Total</span>
                                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.3rem' }}>₹{getTotal()}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="btn-primary"
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '1rem',
                                justifyContent: 'center',
                            }}
                        >
                            Proceed to Checkout <ArrowRight size={18} />
                        </Link>

                        <p style={{
                            textAlign: 'center',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            marginTop: '12px',
                        }}>
                            🔒 Secure checkout powered by Razorpay
                        </p>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx>{`
        @media (max-width: 768px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
