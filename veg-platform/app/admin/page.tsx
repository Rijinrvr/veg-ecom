'use client';

import React, { useEffect, useState } from 'react';
import { Product, Order } from '@/types';
import { Package, ShoppingCart, DollarSign, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/products').then(r => r.json()),
            fetch('/api/orders').then(r => r.json()),
        ]).then(([prods, ords]) => {
            setProducts(prods);
            setOrders(ords);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'confirmed').length;

    const stats = [
        {
            title: 'Total Products',
            value: products.length,
            change: '+3 this week',
            icon: Package,
            color: '#2d6a4f',
            bg: '#dcfce7',
        },
        {
            title: 'Total Orders',
            value: orders.length,
            change: `${pendingOrders} pending`,
            icon: ShoppingCart,
            color: '#0891b2',
            bg: '#cffafe',
        },
        {
            title: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            change: '+12% from last week',
            icon: DollarSign,
            color: '#059669',
            bg: '#d1fae5',
        },
        {
            title: 'Delivered',
            value: deliveredOrders,
            change: `${Math.round((deliveredOrders / (orders.length || 1)) * 100)}% success rate`,
            icon: TrendingUp,
            color: '#d97706',
            bg: '#fef3c7',
        },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: 'var(--primary-dark)',
                    marginBottom: '4px',
                }}>
                    Dashboard
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Welcome back! Here&apos;s an overview of your store.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                marginBottom: '36px',
            }} className="stagger-children">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        style={{
                            background: 'white',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border)',
                            padding: '24px',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px',
                        }}>
                            <div style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: 'var(--radius-md)',
                                background: stat.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <stat.icon size={22} color={stat.color} />
                            </div>
                            <ArrowUpRight size={18} color="var(--success)" />
                        </div>
                        <div style={{
                            fontSize: '1.8rem',
                            fontWeight: 700,
                            color: 'var(--text)',
                            marginBottom: '4px',
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            {loading ? '...' : stat.value}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {stat.title}
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            color: stat.color,
                            fontWeight: 500,
                            marginTop: '8px',
                        }}>
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
            }}>
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <h2 style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        color: 'var(--primary-dark)',
                    }}>
                        Recent Orders
                    </h2>
                    <a href="/admin/orders" style={{
                        fontSize: '0.85rem',
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontWeight: 500,
                    }}>
                        View All →
                    </a>
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading...
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No orders yet
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map(order => (
                                    <tr key={order.id}>
                                        <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.id}</td>
                                        <td>{order.customerName}</td>
                                        <td>{order.items.length} items</td>
                                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{order.total}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                textTransform: 'capitalize',
                                                ...(order.orderStatus === 'delivered'
                                                    ? { background: '#dcfce7', color: '#166534' }
                                                    : order.orderStatus === 'cancelled'
                                                        ? { background: '#fee2e2', color: '#991b1b' }
                                                        : { background: '#dbeafe', color: '#1e40af' }),
                                            }}>
                                                {order.orderStatus.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
