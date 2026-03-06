'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';
import { Order } from '@/types';
import { Package, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const statusColors: Record<string, { bg: string; color: string }> = {
    placed: { bg: '#dbeafe', color: '#1e40af' },
    confirmed: { bg: '#e0e7ff', color: '#3730a3' },
    preparing: { bg: '#fef3c7', color: '#92400e' },
    out_for_delivery: { bg: '#fed7aa', color: '#9a3412' },
    delivered: { bg: '#dcfce7', color: '#166534' },
    cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main className="container" style={{ padding: '40px 20px', flex: 1 }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--primary-dark)',
                    marginBottom: '8px',
                }}>
                    My Orders
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                    Track your vegetable deliveries
                </p>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <Package size={64} color="var(--primary-light)" style={{ marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', fontFamily: "'Inter', sans-serif" }}>
                            No orders yet
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Your order history will appear here once you place your first order.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map((order, index) => {
                            const statusStyle = statusColors[order.orderStatus] || statusColors.placed;
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <div
                                    key={order.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--border)',
                                        overflow: 'hidden',
                                        opacity: 0,
                                        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`,
                                    }}
                                >
                                    {/* Order header */}
                                    <button
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        style={{
                                            width: '100%',
                                            padding: '20px 24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            gap: '16px',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>
                                                Order #{order.id}
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '0.82rem',
                                                color: 'var(--text-muted)',
                                            }}>
                                                <Clock size={14} />
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <span style={{
                                                padding: '6px 14px',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                background: statusStyle.bg,
                                                color: statusStyle.color,
                                                textTransform: 'capitalize',
                                            }}>
                                                {order.orderStatus.replace(/_/g, ' ')}
                                            </span>
                                            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>
                                                ₹{order.total}
                                            </span>
                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </div>
                                    </button>

                                    {/* Expanded details */}
                                    {isExpanded && (
                                        <div style={{
                                            padding: '0 24px 24px',
                                            borderTop: '1px solid var(--border)',
                                            paddingTop: '20px',
                                            animation: 'fadeIn 0.3s ease-out',
                                        }}>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '20px',
                                                marginBottom: '20px',
                                            }} className="order-details-grid">
                                                <div>
                                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                                                        Delivery Address
                                                    </h4>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
                                                        {order.customerName}<br />
                                                        {order.address}<br />
                                                        {order.city} - {order.pincode}<br />
                                                        📞 {order.customerPhone}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                                                        Payment Info
                                                    </h4>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
                                                        Payment ID: {order.paymentId}<br />
                                                        Status: <span style={{
                                                            color: order.paymentStatus === 'completed' ? 'var(--success)' : 'var(--warning)',
                                                            fontWeight: 600,
                                                        }}>
                                                            {order.paymentStatus}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Items */}
                                            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
                                                Items Ordered
                                            </h4>
                                            <div style={{
                                                background: 'var(--primary-50)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '12px',
                                            }}>
                                                {order.items.map((item, i) => (
                                                    <div key={i} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        padding: '8px 0',
                                                        borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none',
                                                        fontSize: '0.88rem',
                                                    }}>
                                                        <span>{item.product.name} × {item.quantity}</span>
                                                        <span style={{ fontWeight: 600 }}>₹{item.product.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />

            <style jsx>{`
        @media (max-width: 768px) {
          .order-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
