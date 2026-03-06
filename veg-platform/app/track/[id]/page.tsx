'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import { Order } from '@/types';
import { ArrowLeft, Phone, MapPin, Clock } from 'lucide-react';

const trackingSteps = [
    { status: 'placed', label: 'Order Placed', icon: '📦', description: 'Your order has been received' },
    { status: 'confirmed', label: 'Confirmed', icon: '✅', description: 'Seller confirmed your order' },
    { status: 'preparing', label: 'Preparing', icon: '🥬', description: 'Packing fresh vegetables' },
    { status: 'out_for_delivery', label: 'On the Way', icon: '🚛', description: 'Your order is out for delivery' },
    { status: 'delivered', label: 'Delivered', icon: '🏠', description: 'Enjoy your fresh vegetables!' },
];

export default function TrackOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch('/api/orders');
                const orders = await res.json();
                const found = orders.find((o: Order) => o.id === id);
                setOrder(found || null);
            } catch (error) {
                console.error('Failed to fetch order');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();

        // Poll for updates every 10 seconds
        const interval = setInterval(fetchOrder, 10000);
        return () => clearInterval(interval);
    }, [id]);

    const getCurrentStepIndex = () => {
        if (!order) return 0;
        if (order.orderStatus === 'cancelled') return -1;
        return trackingSteps.findIndex(s => s.status === order.orderStatus);
    };

    const currentStep = getCurrentStepIndex();

    // Vehicle position as percentage (0-100)
    const getVehiclePosition = () => {
        if (currentStep < 0) return 0;
        return (currentStep / (trackingSteps.length - 1)) * 100;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', animation: 'float 2s ease-in-out infinite' }}>🚛</div>
                        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading order details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!order) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '8px' }}>
                            Order Not Found
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                            We couldn&apos;t find an order with ID: {id}
                        </p>
                        <Link href="/orders" className="btn-primary">View My Orders</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const isCancelled = order.orderStatus === 'cancelled';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="container" style={{ padding: '40px 20px', flex: 1 }}>
                <Link href="/orders" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem',
                    fontWeight: 500, marginBottom: '24px',
                }}>
                    <ArrowLeft size={16} /> Back to Orders
                </Link>

                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '36px', flexWrap: 'wrap', gap: '12px',
                }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '4px' }}>
                            Track Order
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Order #{order.id} • {formatDate(order.createdAt)}
                        </p>
                    </div>
                    {!isCancelled && (
                        <div style={{
                            padding: '8px 20px', borderRadius: 'var(--radius-full)',
                            background: currentStep === trackingSteps.length - 1
                                ? 'linear-gradient(135deg, var(--primary), var(--primary-light))'
                                : 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                            color: 'white', fontWeight: 600, fontSize: '0.85rem',
                            animation: currentStep < trackingSteps.length - 1 ? 'pulse-soft 2s infinite' : 'none',
                        }}>
                            {currentStep === trackingSteps.length - 1 ? '✅ Delivered' : '🔄 Live Tracking'}
                        </div>
                    )}
                </div>

                {isCancelled ? (
                    <div className="animate-fadeInUp" style={{
                        background: '#fee2e2', borderRadius: 'var(--radius-lg)',
                        padding: '40px', textAlign: 'center', marginBottom: '32px',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>❌</div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#991b1b', marginBottom: '8px' }}>
                            Order Cancelled
                        </h3>
                        <p style={{ color: '#991b1b', opacity: 0.7 }}>
                            This order has been cancelled.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* ===== DELIVERY VEHICLE ANIMATION ===== */}
                        <div className="animate-fadeInUp" style={{
                            background: 'white', borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--border)', padding: '40px 32px',
                            marginBottom: '32px', overflow: 'hidden',
                        }}>
                            {/* Road with vehicle */}
                            <div style={{ position: 'relative', marginBottom: '48px', paddingTop: '60px' }}>
                                {/* Sky gradient */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
                                    background: 'linear-gradient(180deg, #e0f2fe 0%, #f0fdf4 100%)',
                                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                                }}>
                                    {/* Clouds */}
                                    <div style={{
                                        position: 'absolute', top: '12px', left: '15%',
                                        fontSize: '1.2rem', opacity: 0.4,
                                        animation: 'slideCloud 15s linear infinite',
                                    }}>☁️</div>
                                    <div style={{
                                        position: 'absolute', top: '8px', left: '55%',
                                        fontSize: '1.5rem', opacity: 0.3,
                                        animation: 'slideCloud 20s linear infinite 5s',
                                    }}>☁️</div>
                                    <div style={{
                                        position: 'absolute', top: '20px', left: '80%',
                                        fontSize: '1rem', opacity: 0.35,
                                        animation: 'slideCloud 12s linear infinite 3s',
                                    }}>☁️</div>
                                </div>

                                {/* Trees along the road */}
                                <div style={{ position: 'absolute', bottom: '36px', left: '5%', fontSize: '1.5rem' }}>🌳</div>
                                <div style={{ position: 'absolute', bottom: '36px', left: '25%', fontSize: '1.2rem' }}>🌲</div>
                                <div style={{ position: 'absolute', bottom: '36px', left: '50%', fontSize: '1.4rem' }}>🌳</div>
                                <div style={{ position: 'absolute', bottom: '36px', left: '75%', fontSize: '1.3rem' }}>🌲</div>
                                <div style={{ position: 'absolute', bottom: '36px', left: '95%', fontSize: '1.5rem' }}>🏠</div>

                                {/* Road */}
                                <div style={{
                                    position: 'relative', height: '36px',
                                    background: 'linear-gradient(0deg, #374151 0%, #4b5563 100%)',
                                    borderRadius: 'var(--radius-sm)',
                                    overflow: 'visible',
                                }}>
                                    {/* Road markings */}
                                    <div style={{
                                        position: 'absolute', top: '50%', left: 0, right: 0,
                                        height: '3px', transform: 'translateY(-50%)',
                                        backgroundImage: 'repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 20px, transparent 20px, transparent 40px)',
                                    }} />

                                    {/* Delivery Vehicle */}
                                    <div style={{
                                        position: 'absolute',
                                        left: `${getVehiclePosition()}%`,
                                        top: '-36px',
                                        transform: 'translateX(-50%)',
                                        transition: 'left 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                        zIndex: 10,
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                                    }}>
                                        <div style={{
                                            fontSize: '2.8rem',
                                            animation: currentStep < trackingSteps.length - 1
                                                ? 'vehicleBounce 0.5s ease-in-out infinite'
                                                : 'none',
                                        }}>
                                            🚛
                                        </div>
                                        {/* Exhaust smoke when moving */}
                                        {currentStep > 0 && currentStep < trackingSteps.length - 1 && (
                                            <div style={{
                                                position: 'absolute', right: '-20px', top: '10px',
                                                fontSize: '0.8rem', opacity: 0.4,
                                                animation: 'smokeRise 1s ease-out infinite',
                                            }}>💨</div>
                                        )}
                                    </div>

                                    {/* Start marker */}
                                    <div style={{
                                        position: 'absolute', left: '0%', top: '-50px',
                                        transform: 'translateX(-50%)',
                                        textAlign: 'center', fontSize: '1.4rem',
                                    }}>📦</div>

                                    {/* End marker */}
                                    <div style={{
                                        position: 'absolute', left: '100%', top: '-50px',
                                        transform: 'translateX(-50%)',
                                        textAlign: 'center', fontSize: '1.4rem',
                                    }}>🏡</div>
                                </div>

                                {/* Progress bar below road */}
                                <div style={{
                                    marginTop: '12px', height: '6px',
                                    background: 'var(--border)', borderRadius: '3px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%', borderRadius: '3px',
                                        background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                                        width: `${getVehiclePosition()}%`,
                                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }} />
                                </div>
                            </div>

                            {/* Status steps */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                position: 'relative', paddingTop: '12px',
                            }}>
                                {trackingSteps.map((step, index) => {
                                    const isCompleted = index <= currentStep;
                                    const isCurrent = index === currentStep;

                                    return (
                                        <div key={step.status} style={{
                                            display: 'flex', flexDirection: 'column',
                                            alignItems: 'center', flex: 1, position: 'relative',
                                        }}>
                                            {/* Connector line */}
                                            {index > 0 && (
                                                <div style={{
                                                    position: 'absolute', top: '20px',
                                                    right: '50%', width: '100%', height: '3px',
                                                    background: isCompleted
                                                        ? 'linear-gradient(90deg, var(--primary), var(--primary-light))'
                                                        : 'var(--border)',
                                                    transition: 'background 0.8s ease',
                                                    zIndex: 0,
                                                }} />
                                            )}

                                            {/* Step circle */}
                                            <div style={{
                                                width: '42px', height: '42px',
                                                borderRadius: '50%', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.2rem', zIndex: 1,
                                                background: isCompleted
                                                    ? 'linear-gradient(135deg, var(--primary), var(--primary-light))'
                                                    : 'white',
                                                border: isCompleted ? 'none' : '3px solid var(--border)',
                                                boxShadow: isCurrent
                                                    ? '0 0 0 6px rgba(45,106,79,0.15), 0 4px 12px rgba(45,106,79,0.3)'
                                                    : isCompleted
                                                    ? '0 4px 12px rgba(45,106,79,0.2)'
                                                    : 'none',
                                                transition: 'all 0.5s ease',
                                                animation: isCurrent ? 'pulse-soft 2s infinite' : 'none',
                                            }}>
                                                {isCompleted ? (
                                                    <span style={{ filter: isCompleted && !isCurrent ? 'none' : 'none' }}>
                                                        {step.icon}
                                                    </span>
                                                ) : (
                                                    <span style={{ opacity: 0.3 }}>{step.icon}</span>
                                                )}
                                            </div>

                                            {/* Label */}
                                            <div style={{
                                                marginTop: '10px', textAlign: 'center',
                                            }}>
                                                <div style={{
                                                    fontSize: '0.75rem', fontWeight: isCurrent ? 700 : 500,
                                                    color: isCompleted ? 'var(--primary-dark)' : 'var(--text-muted)',
                                                    transition: 'color 0.3s ease',
                                                }}>
                                                    {step.label}
                                                </div>
                                                {isCurrent && (
                                                    <div style={{
                                                        fontSize: '0.68rem', color: 'var(--primary)',
                                                        marginTop: '2px', animation: 'fadeIn 0.5s ease-out',
                                                    }}>
                                                        {step.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {/* Order Details Grid */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '24px', marginBottom: '32px',
                }} className="track-details-grid">
                    {/* Delivery Info */}
                    <div className="animate-fadeInUp" style={{
                        background: 'white', borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)', padding: '24px',
                    }}>
                        <h3 style={{
                            fontSize: '1rem', fontWeight: 700, marginBottom: '16px',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            color: 'var(--primary-dark)', fontFamily: "'Inter', sans-serif",
                        }}>
                            <MapPin size={18} /> Delivery Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Name</span>
                                <strong>{order.customerName}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Phone</span>
                                <strong>{order.customerPhone}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Address</span>
                                <strong style={{ textAlign: 'right', maxWidth: '200px' }}>
                                    {order.address}, {order.city} - {order.pincode}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="animate-fadeInUp" style={{
                        background: 'white', borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)', padding: '24px',
                    }}>
                        <h3 style={{
                            fontSize: '1rem', fontWeight: 700, marginBottom: '16px',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            color: 'var(--primary-dark)', fontFamily: "'Inter', sans-serif",
                        }}>
                            <Clock size={18} /> Order Summary
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                            {order.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-light)' }}>
                                        {item.product.name} × {item.quantity}
                                    </span>
                                    <strong>₹{item.product.price * item.quantity}</strong>
                                </div>
                            ))}
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                    <span>₹{order.subtotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                                    <span style={{ color: order.deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>
                                        {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                                    </span>
                                </div>
                            </div>
                            <div style={{
                                borderTop: '2px solid var(--border)', paddingTop: '10px',
                                display: 'flex', justifyContent: 'space-between',
                            }}>
                                <strong style={{ fontSize: '1rem' }}>Total</strong>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>₹{order.total}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Need help */}
                <div className="animate-fadeInUp" style={{
                    background: 'linear-gradient(135deg, var(--primary-50), #fef9c3)',
                    borderRadius: 'var(--radius-lg)', padding: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '16px',
                }}>
                    <div>
                        <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)', fontFamily: "'Inter', sans-serif" }}>
                            Need help with your order?
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                            Contact our customer support team
                        </p>
                    </div>
                    <a href="tel:+911234567890" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                        <Phone size={16} /> Call Support
                    </a>
                </div>
            </main>
            <Footer />

            <style jsx>{`
                @keyframes vehicleBounce {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-3px); }
                }
                @keyframes smokeRise {
                    0% { opacity: 0.4; transform: translate(0, 0) scale(1); }
                    100% { opacity: 0; transform: translate(10px, -15px) scale(1.5); }
                }
                @keyframes slideCloud {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-200px); }
                }
                @media (max-width: 768px) {
                    .track-details-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
